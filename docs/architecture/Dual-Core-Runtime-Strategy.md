# 📑 Krepis 프레임워크 이원화 전략 상세 명세 (v1.5.0)

## 1. 개요 (Executive Summary)

Krepis는 사용자에게 **"Krepis Standard (Pure TypeScript)"**와 **"Krepis Turbo
(Rust Hybrid)"**라는 두 가지 런타임 선택지를 제공합니다. 개발자는 자신의 기술적
숙련도와 프로젝트의 요구 성능에 따라 동일한 코드 베이스 위에서 엔진만을 자유롭게
교체할 수 있습니다.

---

## 2. 이원화 구조 및 역할 정의

### ① Krepis Standard (Pure TypeScript Core)

- **기술 스택:** 100% TypeScript / Node.js
- **특징:** 외부 네이티브 의존성 없이 순수 Node.js 환경에서 동작하는 레퍼런스
  모델.
- **타겟 유저:**
- Node.js 생태계에 익숙한 일반 개발자.
- 빠른 디버깅과 스택 트레이스 확인이 중요한 개발 초기 단계.
- 네이티브 컴파일 환경 구성이 어려운 서버리스(FaaS) 또는 엣지 컴퓨팅 환경.

- **장점:** 설치가 간편하며, 에러 발생 시 모든 추적 정보가 TypeScript 라인으로
  명확히 표기됨.

### ② Krepis Turbo (Rust Hybrid Core)

- **기술 스택:** Rust (Native) + Napi-rs (Bridge) + TypeScript (Wrapper)
- **특징:** 성능 병목이 발생하는 핵심 모듈(`Core`, `Context`, `KNUL`, `DI`)을
  Rust로 재작성하여 네이티브로 실행.
- **타겟 유저:**
- 초당 수만 건 이상의 요청을 처리해야 하는 엔터프라이즈 시스템.
- 강력한 보안(바이너리 레벨 은닉)이 필요한 금융/보안 도메인.
- Rust의 메모리 안전성과 고성능 인프라를 활용하고자 하는 아키텍트.

- **장점:** CPU/메모리 효율 극대화, KNUL 프로토콜을 통한 초저지연 통신, 비즈니스
  로직 보호.

---

## 3. 핵심 운영 전략

### 💡 "코드 한 줄로 전환하는 성능" (Zero-Inertia Switching)

사용자가 작성하는 **비즈니스 로직(Entities, UseCases, Repositories)은 두 런타임
모두에서 100% 동일**합니다.

```typescript
// krepis.config.ts
export const config = {
  // 간단히 모드를 바꾸는 것만으로 엔진 교체
  runtime: process.env.NODE_ENV === 'production' ? 'turbo' : 'standard',
  port: 3000,
  ...
};

```

### 🛠️ 오류 핸들링의 심리적 장벽 제거 (Safe Error Bridge)

Node.js 개발자가 Rust의 난해한 오류(Panic, Memory Error)를 마주했을 때 당황하지
않도록 **에러 브릿지**를 구축합니다.

- **Native-to-TS Error Mapping:** Rust 레이어에서 발생한 시스템 오류를 캡처하여,
  Node.js 개발자에게 익숙한 `KrepisNativeException` 형태로 변환합니다.
- **Trace Recovery:** 네이티브 코드 실행 중 에러가 발생해도, 해당 로직을 호출한
  TypeScript 파일의 위치를 역추적하여 보여줍니다.

---

## 4. 로드맵에 따른 점진적 강화

1. **Phase 1 (Genesis):** 모든 코어와 라이브러리를 **Pure TypeScript**로
   완성하여 v1.0.0 출시. 생태계와 안정성 우선 검증.
2. **Phase 2 (Turbo-charging):** 검증된 로직을 바탕으로 `Core` 및 `KNUL`
   모듈부터 Rust로 포팅 시작.
3. **Phase 3 (Optimization):** 마켓플레이스의 고부하 모듈들을 대상으로 Rust 래핑
   프레임워크 라인업 확장.

---

## 5. 기대 효과 및 비전

- **진입 장벽 최소화:** "어려운 Rust"를 배우지 않아도 Krepis의 아키텍처 가치를
  누릴 수 있습니다.
- **미래 지향적 투자:** 지금 TS로 짠 코드가 서비스가 성장했을 때 코드 수정 없이
  "Turbo" 버전으로 업그레이드만 하면 성능 문제가 해결된다는 믿음을 줍니다.
- **생태계 상생:** 일반 개발자는 TS로 모듈을 기여하고, 고성능이 필요한 전문가는
  Rust로 가속 모듈을 만들어 마켓플레이스에서 협업하는 **이원화 생태계**를
  구축합니다.

---
