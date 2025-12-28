# 📑 [Krepis Spec-004] 시스템 아키텍처 및 CLI 체인 상세 명세서

**버전:** v1.5.0 (The Robust Infrastructure)

**분류:** 물리적 구조, 빌드 파이프라인 및 CLI 워크플로우

---

## 1. 하이브리드 모노레포 아키텍처 (Monorepo & Shared Lib)

- **Unified Workspace:** **`pnpm workspaces`**를 최상위 도구로 사용하며, Rust
  모듈은 **`Cargo Workspaces`**를 통해 통합 관리합니다.
- **Shared Schema (Protobuf):** 프로젝트 최상위의 `@krepis/proto` 패키지에서
  모든 통신 스키마를 정의합니다. CI/CD 과정에서 변경 사항이 생기면
  Rust용(`prost`)과 TS용(`ts-proto`) 코드를 자동 생성하여 양측의 데이터
  인터페이스를 100% 동기화합니다.
- **Architecture:**
- `packages/core`: Pure TS 프레임워크 코어
- `packages/native`: Rust 기반 가속 엔진 (Napi-rs)
- `packages/cli`: Master CLI (Rust) 및 Sub-packages (TS)

---

## 2. CLI 오케스트레이션 및 샌드박스 (CLI Chain)

- **Master CLI Execution:** Rust로 작성된 Master CLI는 시스템에 설치된 최적의
  Node.js 런타임을 탐지하여 서브 패키지를 실행합니다. 이때, 성능을 위해
  **`Worker Threads`**를 활용하여 병렬로 명령을 처리합니다.
- **샌드박스 환경 (Isolated Sandbox):** 각 서브 커맨드 실행 시
  **`Node.js VM 모듈`** 또는 **`Worker Threads`**를 사용하여 환경을 격리합니다.
  이는 특정 플러그인이나 모듈의 에러가 Master CLI 전체의 패닉으로 이어지는 것을
  방지합니다.
- **Undo/Redo (Transaction Log):** CLI를 통한 모든 파일 수정(AST 조작) 전,
  `.krepis/history` 폴더에 원본 파일의 스냅샷과 변경 사항(Diff)을 **SQLite(또는
  Sled)** 기반 로그로 기록합니다. `krepis undo` 명령 시 즉시 이전 상태로 복구가
  가능합니다.

---

## 3. Smart Generator 및 패키지 시스템 (Generator & Marketplace)

- **Deep AST Manipulation:** `ts-morph`를 활용하여 단순 파일 생성을 넘어, 기존
  소스코드의 **클래스 내부 메서드 주입, 데코레이터 동적 추가, 의존성 주입 코드
  갱신**을 수행합니다. 아키텍처 규칙 위반 여부를 실시간 검사하며 코드를
  주입합니다.
- **Krepis Package (.kpkg):** 마켓플레이스 모듈은 소스코드(TS)와 메타데이터,
  그리고 필요한 경우 빌드된 바이너리를 포함한 단일 압축 포맷인 **`.kpkg`**로
  유통됩니다.
- **Isolated Dependencies:** `krepis add`로 추가된 모듈은 메인 프로젝트의
  `node_modules`와 충돌하지 않도록, Krepis 전용 로컬 저장소에 캐싱된 후 **심볼릭
  링크(Symbolic Link)** 방식으로 참조됩니다.

---

## 4. 고성능 바인딩 및 배포 (Native Binding & Delivery)

- **Pre-built Binary 배포:** 사용자가 프레임워크를 설치할 때 `node-pre-gyp` 또는
  GitHub Actions를 통해 빌드된 운영체제별 **Native Addon(.node 파일)**을
  자동으로 다운로드합니다. 사용자는 Rust 컴파일러를 직접 설치할 필요가 없습니다.
- **Dynamic Runtime Loading:** `Standard` 모드에서는 순수 TS 엔진만 로드하며,
  설정에서 `Turbo` 모드 활성화 시에만 **`require()` / `import()`를 통해 네이티브
  바인딩을 동적으로 로드**하여 초기 구동 속도를 최적화합니다.

---

## 5. 로컬 데이터 인프라 (Sled DB & Security)

- **Sled DB의 역할:** \* **Caching:** AST 분석 결과 및 마켓플레이스 모듈 인덱스
  캐싱 (성능 향상).
- **Persistence:** 섀도우 테스팅 결과 및 로컬 트랜잭션 로그 저장.

- **Security & Encryption:** 로컬에 저장되는 인증 토큰 및 민감 메타데이터는
  시스템의 **OS 키체인(Secret Service API, Keychain 등)**과 연동된 마스터 키를
  사용하여 `AES-256-GCM`으로 암호화 저장합니다.

---

## 6. 서드파티 플러그인 거버넌스 (Plugin Ecosystem)

- **Strict Validation Pipeline:** 외부 개발자가 작성한 플러그인은 Krepis
  플랫폼에 먼저 업로드되어야 합니다.
- **검수 프로세스:**

1. **정적 분석:** 악성 코드(Network Exfiltration, FS 조작) 여부 검사.
2. **아키텍처 적합성:** Krepis CLI 표준 규격 준수 여부 확인.
3. **AI Sentinel:** AI가 플러그인의 로직을 분석하여 잠재적 위험 요소를 리포팅.

- **승인 및 배포:** 모든 검사를 통과한 플러그인에 한해 **디지털 서명**이
  부여되며, 사용자는 `krepis plugin install`을 통해 안전하게 설치할 수 있습니다.

---
