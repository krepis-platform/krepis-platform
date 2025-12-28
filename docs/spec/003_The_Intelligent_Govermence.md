# 📑 [Krepis Spec-003] 계층형 AI 클러스터 및 성장 모델 상세 명세서

**버전:** v1.5.0 (The Intelligent Governance)

**분류:** AI 아키텍처, 데이터 정책 및 의사결정 프로세스

---

## 1. 비식별 AST 기반 데이터 정책 (Privacy-Preserving AI)

### 1.1 추상화 및 비식별화 (Abstraction & Masking)

- **Type-Oriented Masking:** 코드의 구체적인 로직(리터럴 값, 변수명)은 마스킹
  처리하되, **타입 정보와 인터페이스 관계**는 유지합니다. (예:
  `calculateTax(amount: number)` → `funcA(param1: number)` 및 `Entity` 간의
  관계망 유지)
- **DLP (Data Leak Prevention) 내장:** 로컬 CLI 수준에서 API Key, 개인정보, 기밀
  패턴을 감지하여 전송 전 원천 차단하는 DLP 필터링 레이어를 가동합니다.

### 1.2 전송 전략 (Transmission Strategy)

- **Adaptive Context Injection:** \* 소규모 프로젝트: 구조적 맥락 파악을 위해
  전체 AST를 일시 전송합니다.
- 대규모 프로젝트: 수정된 파일과 직접적 의존 관계(Dependency Graph)에 있는
  모듈만 추출하여 **증분(Incremental)** 방식으로 전송하여 대역폭과 보안 노출을
  최소화합니다.

---

## 2. 계층형 AI 의사결정 시스템 (Consensus & Governance)

### 2.1 하이브리드 합의 알고리즘 (Dual-Decision Interface)

- **Conflict Resolution:** 보안, 성능, 구조 전문가 AI 간의 의견이 충돌할 경우
  시스템은 두 가지 안을 동시에 제시합니다.

1. **다수결 안 (Consensus View):** 다수의 서브 클러스터가 동의한 안정적인 대안.
2. **Master AI 판결 안 (Executive View):** 프로젝트 전체 맥락을 고려한 Master
   AI의 최적화 제안.

- **Human-in-the-loop:** 사용자는 두 제안의 차이점과 근거를 확인한 후 최종
  방향을 선택하며, 이 선택은 다시 AI의 선호도 학습(RLHF) 데이터로 활용됩니다.

### 2.2 지능형 근거 제시 및 신뢰도 (Explainable AI)

- **Standard-Linked Reasoning:** AI가 수정을 제안할 때, **Krepis 표준
  명세서(Spec-001~N)의 해당 조항 링크**를 주석이나 리포트 형태로 함께
  제공합니다.
- **Confidence Scoring:** 제안된 코드의 안정성과 정합성을 0~100% 점수로
  표기하며, 임계값 미만인 경우 인간 아키텍트의 수동 검토를 강제하는
  Safety-lock을 작동시킵니다.

---

## 3. 지식 베이스 및 실시간 성장 (Knowledge & RAG)

### 3.1 RAG (Retrieval-Augmented Generation) 구성

- **Source of Truth:** Krepis 공식 도큐먼트뿐만 아니라, **마켓플레이스 상위 5%의
  고평가 오픈소스 모듈**의 구조적 패턴을 벡터 DB화하여 참조합니다.
- **Real-time Security Patch:** 새로운 보안 취약점이나 아키텍처 안티 패턴이
  발견되면 RAG 지식 베이스를 즉시 업데이트하여, 모든 사용자의 AI 가이드가
  실시간으로 해당 패턴을 경고하도록 파이프라인을 구축합니다.

### 3.2 셀프 피드백 루프 (Self-Correction Loop)

- **Shadow Test Feedback:** 섀도우 테스팅 결과(성능 저하, 로직 불일치 등)가
  수집되면 AI는 이를 즉시 피드백 받아 코드를 재수정(Self-Correction)합니다. 이
  과정은 인간에게 PR이 도달하기 전 최적의 코드를 만들기 위한 내부 루프로
  작동합니다.

---

## 4. 컴퓨팅 리소스 및 티어별 고립 (Infrastructure Strategy)

### 4.1 하이브리드 컴퓨팅 옵션

- **Local vs Cloud:** 사용자는 비용 효율성과 보안 요구사항에 따라 AI 추론 환경을
  선택할 수 있습니다.
- **Local GPU:** 사용자 로컬 자원을 사용하여 비용을 절감하고 데이터 외부 유출을
  심리적으로 차단.
- **Cloud Cluster:** 고성능 클러스터를 통해 복잡한 전체 구조 분석 및 대규모 연산
  수행.

### 4.2 Fine-tuning 및 데이터 주권

- **Sovereign AI Option:** Enterprise 티어에서 제공되는 미세 조정(Fine-tuning)
  기능 사용 시, 해당 데이터가 Krepis DB에 저장되어 학습에 활용된다는 사실을
  투명하게 고지하고 명시적 동의를 구합니다. 각 기업 전용의 고립된 모델
  인스턴스를 보장합니다.

---
