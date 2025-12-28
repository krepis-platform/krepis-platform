# 📑 [Krepis Spec-001] 프로젝트 비전 및 하이브리드 철학 상세 명세서

**버전:** v1.5.0 (The Hybrid Synergy)

**분류:** 핵심 전략 및 아키텍처 원칙

---

## 1. 서비스 정의: ADaaS (Architecture Development as a Service)

Krepis는 소프트웨어의 생애주기(SDLC) 전체를 자율적으로 관리하는 **'아키텍처 자율
주행'** 플랫폼입니다. 단순히 코드를 생성하는 것을 넘어, 구조적 무결성을 유지하고
스스로 진화하는 시스템을 지향합니다.

### 1.1 자율 주행 매커니즘 (Autonomous Operation)

- **데이터 주도적 분석 (Data-Driven Insight):** 전용 CLI와 SDK를 통해 런타임의
  모든 요청(Request)과 응답(Response) 패턴, 데이터 변이 및 의존성 호출 그래프를
  실시간으로 수집 및 인덱싱합니다.
- **섀도우 테스팅 및 검증 (Shadow Testing):** AI가 제안하거나 개발자가 수정한
  신규 코드는 즉시 배포되지 않습니다. 기존 안정 코드(99%)와 신규 코드(1%)로 실제
  트래픽을 분산하여 논리적 정합성과 성능 지표를 내부적으로 대조 검증합니다.
- **지능형 PR 및 인간 승인 (Human-in-the-loop):** 검증 결과가 임계치를 통과하면
  AI는 변경 이력, 성능 개선 리포트, 수정 사유를 포함한 정교한 PR을 생성합니다.
  인간 아키텍트는 최종 보고서를 확인한 후 승인 버튼 클릭 한 번으로 자동 머지 및
  배포를 완료합니다.

### 1.2 사용자 페르소나별 가치 (Target Value)

- **Junior Devs (Architectural Education):** 아키텍처 지식이 부족한 개발자에게
  헥사고날 패턴의 규칙을 실시간으로 피드백하며 교육합니다. "배우면서 동시에
  올바른 코드를 짜는" 경험을 제공합니다.
- **Senior Architects (Operational Excellence):** 시니어 개발자에게는 반복적인
  보일러플레이트와 인프라 설정 업무를 완전히 제거해주어, 비즈니스 도메인 설계와
  고수준 전략에만 집중할 수 있는 환경을 제공합니다.

---

## 2. 하이브리드 엔진 철학 (The Dual-Core Strategy)

Krepis는 성능과 생산성의 트릴레마를 해결하기 위해 **Rust 네이티브 가속**과
**TypeScript의 유연성**을 결합한 하이브리드 구조를 채택합니다.

### 2.1 전략적 런타임 전환 (Strategic Switching)

- **Krepis Standard (Pure TS):** 100% TypeScript로 동작하며, 디버깅의 용이성과
  빠른 생산성을 제공합니다.
- **Krepis Turbo (Rust Hybrid):** 성능 임계치(latency, memory)를 초과하거나 보안
  강화가 필요할 때 활성화됩니다. 핵심 모듈이 네이티브 바이너리로 교체되어
  압도적인 효율을 냅니다.
- **의사결정 기준:** CLI 내부의 분석 도구가 서버 비용 절감액과 운영 효율성을
  계산하여, Rust Turbo 모드가 압도적으로 우세하다고 판단될 때 전환을 권고하거나
  자동 실행합니다.

### 2.2 하이브리드 통신 및 안정성 (Bridge & Reliability)

- **Hybrid Serialization (Protobuf + SAB):** \* **기본 통신:** **Protocol
  Buffers**를 사용하여 Rust와 TS 간의 엄격한 타입 안정성을 보장하고 인터페이스를
  일치시킵니다.
- **고속 가속:** 대용량 패킷 처리나 실시간 지표 수집 시 **SharedArrayBuffer**를
  통한 Zero-copy 메모리 공유 방식을 부분적으로 채택하여 I/O 병목을 제거합니다.

- **에러 브릿지 및 고립 (Error Isolation):** 네이티브 영역의 오류(Panic)가
  Node.js 프로세스 전체에 영향을 주지 않도록 각 태스크를 고립시켜 실행합니다.
  네이티브 에러는 TS 예외 객체로 맵핑되어 개발자에게 익숙한 `try-catch` 환경을
  제공합니다.

---

## 3. 아키텍처 제약 및 독립성 정책

### 3.1 강제된 일관성 (Hard-Constrained Architecture)

Krepis는 '유연한 아키텍처'라는 이름의 무질서를 허용하지 않습니다.

- **컴파일 에러 기반 제약:** 헥사고날 아키텍처의 계층 침범(예: 도메인에서 인프라
  직접 참조)이 발견될 경우, TypeScript Compiler API를 활용하여 빌드 타임에
  강력한 컴파일 에러를 발생시킵니다.
- **구조적 정답 강제:** 프레임워크 자체가 올바른 아키텍처를 강제함으로써 기술
  부채의 누적을 원천 차단합니다.

### 3.2 탈출 전략 및 자산 보존 (No Lock-in Policy)

- **표준 기반 코드 추출:** 사용자가 플랫폼을 떠나더라도 비즈니스 로직(Domain,
  Application)은 순수 TS 코드로 보존됩니다.
- **의존성 유지와 변환:** Krepis 고유의 Context Propagation 및 DI 시스템을
  사용하므로 완전한 바닐라 JS로의 변환은 지양합니다. 대신, 플랫폼에 독립적인
  **'표준 TS 프레임워크 코드'** 형태의 Export 기능을 제공하여 타 환경으로의
  이식을 지원합니다.

---

## 4. 핵심 가치 요약 (The Krepis Pillars)

| 가치                     | 설명                 | 기술적 실현                    |
| ------------------------ | -------------------- | ------------------------------ |
| **Inviolable Structure** | 아키텍처 무결성 강제 | 빌드 타임 AST 분석 및 제약     |
| **Hybrid Power**         | 네이티브급 성능 제공 | Rust/Napi-rs 하이브리드 브릿지 |
| **Autonomous Dev**       | 개발 자동화 및 검증  | Shadow Testing 및 AI PR 생성   |
| **Privacy First**        | 소스 코드 IP 보호    | 비식별 AST 기반 AI 학습/추론   |

---
