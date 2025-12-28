# 📑 [Krepis] 1. 하이브리드 모노레포 통합 빌드 파이프라인 상세 명세

## 1.1 아티팩트 및 타입 관리 (Artifacts & Types)

- **바이너리 위치 (Native Bridge):** Rust 빌드 결과물(`.node`)은
  `packages/native/artifacts`에 플랫폼별(target triple) 네이밍으로 집중
  관리합니다. 각 패키지는 이 중앙 저장소를 참조하는 래퍼(Wrapper)를 가집니다.
- **타입 정의 동기화:** `napi-rs`의 자동 생성 기능을 활용하여 Rust 코드 컴파일
  직후 `index.d.ts`를 즉시 갱신합니다. 이를 통해 TS 레이어는 항상 최신 네이티브
  인터페이스를 타입 안정성이 보장된 상태로 참조합니다.

## 1.2 Turbo 태스크 의존성 설계 (Dependency Graph)

Turbo를 통해 불필요한 재빌드를 방지하고 병렬성을 극대화합니다.

- **빌드 순서:**

1. `build:native` (Rust 컴파일 + 타입 생성)
2. `build:ts` (TS 컴파일, `native` 아티팩트 의존)

- _효율화:_ 변경 사항이 없는 경우 Turbo의 로컬/원격 캐시를 사용하여 1초 이내에
  통과시킵니다.

- **Global Dependencies:** `Cargo.toml`, `rust-toolchain.toml`,
  `tsconfig.base.json`을 전역 해시 요소로 설정하여, 환경 설정 변경 시 전체
  파이프라인이 안전하게 재검증되도록 합니다.

## 1.3 로컬 개발 환경 (DX: Development Loop)

- **Watch Mode 통합:** `cargo-watch`와 `tsup --watch`를 병렬로 실행합니다.
- **동작 방식:** Rust 코드 수정 시 네이티브 바이너리가 재빌드되는 동안, TS
  레이어는 **기존에 빌드되어 있던 마지막 성공 바이너리**를 참조하여 개발 흐름이
  끊기지 않게 유지합니다. 빌드가 완료되면 즉시 새 바이너리로
  교체(Hot-reload)됩니다.

## 1.4 CI/CD 및 멀티 플랫폼 전략

- **멀티 플랫폼 빌드:** GitHub Actions의 **Matrix Build**를 사용하여 `Ubuntu`,
  `macOS`, `Windows` 환경에서 병렬 빌드합니다.
- **Cross-compilation:** 복잡한 환경 설정을 최소화하기 위해 기본적으로 각 OS의
  Native Runner를 사용하되, 가벼운 Linux 배포판(Musl)을 위해 `zig-cc` 기반의
  크로스 컴파일을 부분적으로 도입합니다.
- **체크섬(Checksum) 의무화:** 빌드 파이프라인 마지막 단계에서 모든 플랫폼별
  바이너리에 대해 `SHA-256` 해시를 생성하고 `checksums.txt`에 기록합니다. 런타임
  설치 시 이 해시를 대조하여 위변조를 원천 차단합니다.

## 1.5 빌드 설정 공유 (Build-time Config)

- **표준 방식:** `turbo.json`의 `env` 설정을 통해 환경 변수를 관리하며, 컴파일
  시점에 `cargo`에 `--features` 플래그로 전달합니다. 중요한 설정은
  `Cargo.toml`의 프로파일을 통해 관리하여 빌드 결과물의 최적화 레벨(Release vs
  Debug)을 제어합니다.

---

## 🛠️ 고도화된 `turbo.json` 명세 (예시)

```json
{
  "tasks": {
    "build:native": {
      "inputs": ["native/src/**", "native/Cargo.toml", "tools/schema/**"],
      "outputs": ["native/artifacts/**", "native/index.d.ts"],
      "cache": true
    },
    "build:ts": {
      "dependsOn": ["^build:native"],
      "inputs": ["src/**", "package.json"],
      "outputs": ["dist/**"],
      "cache": true
    },
    "test": {
      "dependsOn": ["build:ts"],
      "inputs": ["tests/**"],
      "outputs": ["coverage/**"]
    }
  }
}
```

---
