# 📑 [Krepis] 2. 언어별 코드 품질 및 스타일 가드 상세 명세

## 2.1 TypeScript 품질 표준 (The Governance)

### [2.1.1] 명명 및 선언 규칙

- **인터페이스 (I-Prefix):** 모든 인터페이스는 `I` 접두사를 사용합니다 (예:
  `IUserRepository`). 이는 구체 클래스와 추상 인터페이스를 시각적으로 즉시
  분리하여 아키텍처 흐름 파악을 돕습니다.
- **Decorator & Metadata:** DI 클래스에는 `@Injectable()`과 함께 아키텍처
  메타데이터 데코레이터(`@DomainService`, `@ApplicationUseCase`,
  `@InfraAdapter`)를 반드시 병기하여 레이어의 소속을 명확히 합니다.

### [2.1.2] 엄격도 (Strictness) 및 임포트 제약

- **Zero Any Policy:** `any` 사용은 원칙적으로 금지하며, 컴파일 에러로
  처리합니다. 불가피한 경우 `unknown`을 사용하고 Type Guard를 거쳐야 합니다.
- **Import 가드:** `ESLint`와 `dependency-cruiser`를 연동하여, 상위
  레이어(Domain)가 하위 레이어(Infra)의 구체 클래스를 임포트하는 것을 빌드
  타임에 차단합니다.

## 2.2 Rust 품질 표준 (The Performance)

### [2.2.1] 안전성 및 린트 수준

- **Clippy (Pedantic+):** `clippy::pedantic`을 기본 적용하며, 추가로
  `clippy::all`, `clippy::nursery` 중 안정성이 검증된 규칙을 활성화합니다.
- **Unsafe 관리:** `unsafe` 블록은 성능상 반드시 필요한 경우에만 허용하며,
  상단에 `// SAFETY: <이유>` 주석을 통해 메모리 안전성이 확보된 논리적 근거를
  반드시 명시해야 합니다.

### [2.2.2] 에러 처리 및 모듈 가시성

- **Error Bridge:** Rust의 `Result<T, E>`는 전용 변환 트레이트를 통해 TS의
  `StandardError` 객체로 자동 매핑됩니다.
- **Encapsulation:** 모든 모듈과 필드는 기본적으로 `pub(crate)` 또는 `private`을
  유지하며, 패키지 외부로 노출되는 인터페이스만 엄격하게 `pub`으로 선언합니다.

## 2.3 공통 표준 및 자동화 (The Integration)

### [2.3.1] 스타일 및 문서화

- **Case Conversion:** `NAPI-RS` 설정을 통해 Rust의 `snake_case`와 TS의
  `camelCase`를 자동 변환합니다. 개발자는 각 언어의 관례(Idiom)에만 집중합니다.
- **Documentation First:** 모든 공개(Public) API는 `JSDoc` 또는 `Rustdoc`이
  누락될 경우 빌드 경고를 발생시킵니다. 이는 `Typedoc`과 `Cargo doc`을 통해 통합
  문서 사이트로 자동 배포됩니다.

### [2.3.2] 코드 위생 및 라이선스 관리

- **TODO/FIXME 제한:** `TODO` 주석이 포함된 코드는 로컬 개발은 허용하나,
  `Production` 빌드 시에는 에러를 발생시켜 기술 부채가 마스터 브랜치에 방치되는
  것을 막습니다.
- **Copyright Header:** 모든 소스 파일 상단에 Krepis 라이선스 정보(MIT)와
  소유권 문구를 자동으로 삽입하는 커스텀 스크립트를 `pre-commit` 단계에
  배치합니다.

---

## 🛠️ 품질 가드 구성 요약 테이블

| 구분            | TypeScript (ESLint/Prettier)      | Rust (Clippy/Rustfmt)                     |
| --------------- | --------------------------------- | ----------------------------------------- |
| **핵심 명명**   | `I` Interface, `PascalCase` Type  | `snake_case` Func, `PascalCase` Struct    |
| **엄격도**      | `Strict: true`, `No-Any`          | `Pedantic`, `No-Unsafe (without comment)` |
| **레이어 가드** | Layer-based Import Restriction    | Crate-level Visibility Control            |
| **에러 처리**   | Try-Catch with Custom Error Class | Result<T, E> with anyhow/thiserror        |
| **자동화**      | Git Hooks (Husky)                 | Cargo Check / Clippy CI                   |

---
