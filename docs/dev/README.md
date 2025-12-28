# 📑 [Krepis] 개발 환경 및 품질 관리 표준 명세서 (v1.0.0)

**문서 번호:** KRP-STD-2025-001

**대상을:** 모든 패키지(`packages/*`), 애플리케이션(`apps/*`), 도구(`tools/*`)

**핵심 가치:** 아키텍처 강제(Enforcement), 빌드 가속(Performance), 무결성
보장(Integrity)

---

## 0. 개요: 하이브리드 모노레포 전략

Krepis는 고성능 아키텍처 엔진(Rust)과 유연한 비즈니스 로직(TypeScript)을
결합합니다. 이를 위해 **Turborepo**를 오케스트레이터로 사용하여 두 언어의 빌드
및 검증 사이클을 단일 파이프라인으로 통합합니다.

[Details](./0_Hybrid_Monorepo_Strategy.md)

---

## 1. 뼈대: 하이브리드 모노레포 통합 빌드 파이프라인

Node.js와 Rust의 서로 다른 빌드 생태계를 `Turbo` 환경 아래 단일 워크플로우로
묶는 규격입니다.

### [1.1] 작업(Task) 명명 규칙

- 모든 패키지는 언어와 관계없이 다음의 표준 태스크를 구현해야 합니다.
- `build`: 최종 결과물(dist, .node) 생성
- `test`: 단위 및 통합 테스트 실행
- `lint`: 코드 스타일 및 정적 분석
- `typecheck`: 타입 안정성 검증 (TS 한정)

### [1.2] 의존성 전파 규칙

- `packages/native`(Rust)의 변경은 `@krepis/core`(TS)의 빌드보다 우선순위를
  가집니다.
- Rust 코드가 수정되면 `build:native` -> `generate:types` -> `build:core` 순서로
  자동 연쇄 빌드가 발생해야 합니다.

[Details](./1_Hybrid_Monorepo_Integration_Build_and_Pipeline_Strategy.md)

---

## 2. 규범: 언어별 코드 품질 및 스타일 가드

두 언어의 이질성을 최소화하고, Krepis의 아키텍처 원칙을 코드 수준에서
강제합니다.

### [2.1] TypeScript (The Governance Layer)

- **ESLint:** Flat Config 기반으로 `Domain` -> `Infrastructure` 참조를
  금지합니다.
- **Naming:** 인터페이스는 `I` 접두사, 에넘은 `PascalCase`, 상수는
  `UPPER_CASE`를 사용합니다.
- **Strict Mode:** `any` 사용을 엄격히 금지하며, 모든 비동기 호출은
  `Resilience Policy`를 검토해야 합니다.

### [2.2] Rust (The Performance Layer)

- **Clippy:** `clippy::pedantic` 수준의 엄격한 린팅을 적용하여 메모리 안전성과
  성능을 확보합니다.
- **Safety:** `unsafe` 블록 사용 시 반드시 타당한 이유를 주석(Safety Reason)으로
  명시해야 합니다.
- **Convention:** Rust의 표준 `snake_case`를 따르되, TS 브릿지 노출 시 네이밍
  변환 규칙을 준수합니다.

[Details](./2_Detailed_specifications_for_code_quaility_and_style_guards_by_language.md)

---

## 3. 검증: 아키텍처 가드 및 테스트 자동화

작성된 코드가 헥사고날 아키텍처와 비즈니스 요구사항을 만족하는지 검증하는
단계입니다.

### [3.1] 아키텍처 가드 (Dependency Cruiser)

- 계층 위반 시 빌드를 즉시 중단합니다.
- 외부 라이브러리(Node.js 내장 모듈 포함)가 `Domain` 레이어에 침투하는 것을
  감지합니다.

### [3.2] 테스트 전략

- **커버리지:** 전체 구문/함수/라인에 대해 최소 **70%** 이상을 유지합니다.
- **격리:** 테스트는 병렬로 수행되어야 하며, 데이터베이스나 네트워크 등 외부
  상태에 의존하는 테스트는 반드시 `Adapter` 레이어에서 Mocking/Container를 통해
  격리합니다.

[Details](./3_Architecture_Guard_and_Test_Automation_Datail_Specification.md)

---

## 4. 소통: 협업 및 커밋 표준

데이터 및 변경 이력의 일관성을 유지하기 위한 규약입니다.

### [4.1] Conventional Commits

- `feat(core):`, `fix(sknul):`와 같이 도메인 중심의 `Scope`를 반드시 지정합니다.
- 모든 커밋은 Husky에 의해 `commitlint`와 `lint-staged`를 통과해야 합니다.

### [4.2] 공유 스키마 (Shared Schema)

- Rust와 TS 간의 통신 데이터 구조는 반드시 `tools/schema`에 정의된 규격을 통해
  생성(Auto-gen)되어야 하며, 수동으로 인터페이스를 복사/붙여넣기 하는 행위를
  금지합니다.

---
