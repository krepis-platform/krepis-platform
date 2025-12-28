# 📑 [Krepis] 0. 개요: 하이브리드 모노레포 전략 상세 명세

## 0.1 아키텍처 비전 (Hybrid Core Architecture)

Krepis는 성능 지향적 시스템 프로그래밍(Rust)과 유연한 비즈니스
오케스트레이션(TypeScript)을 결합합니다. 초기에는 인프라와 제어권에 집중하지만,
향후 도메인 연산까지 확장 가능한 유연한 구조를 지향합니다.

---

## 0.2 핵심 전략 명세

### 1. 역할 분담 및 확장성 (Strategic Layering)

- **현재 (Runtime & Infra):** Rust는 `KNUL` 프로토콜 패킷 전송, 프로세스
  격리(Sandbox), 그리고 CLI의 네이티브 실행 환경을 담당합니다.
- **미래 (Analysis Engine):** AST 파싱 및 대규모 아키텍처 검증 로직이 고도화될
  경우, TypeScript의 성능 한계를 극복하기 위해 `packages/native` 내부에 분석
  엔진 모듈을 점진적으로 이관합니다.
- **브릿지:** 모든 네이티브 기능은 `NAPI-RS`를 통해 TypeScript에 `interface`
  형태로 노출됩니다.

### 2. 배포 및 설치 전략 (Pre-compiled Artifacts)

- **표준 방식:** 사용자의 편의성을 위해 **Pre-compiled Binary** 배포를
  채택합니다.
- **메커니즘:** CI(GitHub Actions)에서 `x86_64`, `arm64` 등 주요 타겟별로
  `.node` 바이너리를 사전 빌드하여 npm에 업로드합니다.
- **이점:** 사용자는 로컬에 Rust 툴체인이 없어도 `pnpm install`만으로 즉시
  Krepis를 사용할 수 있습니다.

### 3. 데이터 교환 및 직렬화 (Efficiency First)

- **표준 방식:** **Zero-copy Shared Buffer** 및 **Protocol Buffers(Protobuf)**를
  사용합니다.
- **상세:** \* 가벼운 명령 제어는 `NAPI`의 원시 타입 전달을 사용합니다.
- 대규모 AST나 패킷 데이터 전송 시에는 메모리 복사 비용을 줄이기 위해 `Buffer`를
  통한 직접 참조 방식을 사용하며, 데이터 구조는 Protobuf로 규격화하여 언어 간
  정합성을 보장합니다.

### 4. 개발 환경 통합 (Unified Command System)

- **표준 방식:** **Turborepo 기반의 단일 파이프라인**을 구축합니다.
- **DX 최적화:** `pnpm dev` 명령 시, Rust는 변경 감지 후 **Incremental Build**를
  수행하고, TS는 **HMR(Hot Module Replacement)**을 유지합니다.
- **격리:** Rust 빌드가 무거워질 경우를 대비하여 `turbo`의 캐싱을 활용하며,
  평소에는 빌드된 바이너리만 사용하다가 필요시에만 네이티브 빌드를 트리거합니다.

### 5. 버전 관리 정책 (Lock-step Versioning)

- **표준 방식:** **Single-version Policy (Lock-step)**를 채택합니다.
- **이유:** 네이티브 바이너리와 TS 인터페이스 간의 바이너리 호환성(ABI) 문제를
  방지하기 위해, 모든 패키지는 동일한 버전 번호를 공유하며 함께 릴리스됩니다.
  이를 위해 `Changesets`과 `Turborepo`의 릴리스 기능을 활용합니다.

### 6. 런타임 보안 및 샌드박스 (Secure Execution)

- **표준 방식:** **Capability-based Security (권한 기반 보안)**를 적용합니다.
- **상세:** CLI가 사용자 코드를 실행할 때, Rust 레이어에서 **시스템 콜
  가로채기(System Call Interception)** 또는 **OS 레벨의 프로세스 격리**를 통해
  미인가 파일 접근이나 네트워크 통신을 엄격히 제한합니다. (Deno나 Docker의 보안
  모델과 유사)

---

## 0.3 하이브리드 워크스페이스 구조 (예시)

```text
/ (Root)
├── Cargo.toml          # Rust Workspace (cli, sknul, native)
├── package.json        # Node.js Workspace & Scripts
├── turbo.json          # Hybrid Pipeline Orchestration
├── packages/
│   ├── native/         # NAPI-RS Bridge & Engine (Rust)
│   ├── core/           # TS Business Logic & DI
│   └── sknul/          # Protocol Implementation (Rust/TS)
└── apps/               # Deployment Units

```

---
