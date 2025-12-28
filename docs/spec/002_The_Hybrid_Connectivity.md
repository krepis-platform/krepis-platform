# 📑 [Krepis Spec-002] 차세대 통신 표준: KNUL 상세 명세서

**버전:** v1.5.0 (The Hybrid Connectivity)

**분류:** 네트워크 프로토콜 및 데이터 전송 규격

---

## 1. 프로토콜 레이어 및 연결 관리 (Connectivity)

### 1.1 QUIC 기반 0-RTT 핸드셰이크

- **구현 매커니즘:** Rust의 `quinn` 라이브러리를 커스터마이징하여 구현합니다.
- **Session Resumption:** 첫 연결 시 서버로부터 발급받은 `NewSessionTicket`을
  클라이언트 로컬의 고성능 KV 저장소인 **`sled`**에 저장합니다. 재연결 시 이
  티켓을 사용하여 TLS 핸드셰이크 과정을 생략하고 첫 번째 패킷에 데이터를 실어
  보내는 **0-RTT**를 실현합니다.
- **보안 정책:** 세션 티켓은 24시간 후 자동 만료되며, IP 주소가 변경될 경우
  보안을 위해 1-RTT로 강제 전환됩니다.

### 1.2 네트워크 적응성 (Adaptability)

- **v1.x 로드맵:** 초기 버전에서는 표준 QUIC의 경로 검증 기능을 사용합니다.
- **v2.x 로드맵 (Hole Punching):** 전용 STUN/TURN 서버 로직을 KNUL 내부에
  통합하여, 복잡한 NAT 환경에서도 P2P에 준하는 통신 효율을 확보할 예정입니다.

---

## 2. 하이브리드 데이터 처리 엔진 (Data Processing)

### 2.1 분기형 직렬화 (Hybrid Serialization)

데이터의 성격과 크기에 따라 최적의 통로를 자동으로 선택합니다.

- **Protocol Buffers (Control Plane):** 1MB 미만의 일반 API 메시지, 제어 신호,
  메타데이터에 사용합니다. 스키마 기반으로 Rust와 TS 간의 타입 안전성을
  보장합니다.
- **SharedArrayBuffer (Data Plane):** 1MB 이상의 대용량 바이너리(모듈 패키지,
  대량 로그 등)에 사용합니다. Rust가 할당한 메모리 주소를 JS가 직접 참조하여
  **Zero-copy** 전송을 실현합니다.

### 2.2 스키마 버전 관리 전략 (Schema Versioning)

- **Backwards Compatibility:** Protobuf의 필드 번호를 고정하고 `optional`
  예약어를 적극 활용하여, 서버 버전이 올라가도 구버전 CLI가 오동작하지 않게
  설계합니다.
- **Registry System:** BaaS 서버 내부에 `Schema Registry`를 두어, 클라이언트
  접속 시 최신 스키마 버전을 체크하고 필요시 동적으로 브릿지 코드를
  업데이트합니다.

---

## 3. 고도화된 압축 및 가속 (Compression & Acceleration)

### 3.1 하이브리드 시맨틱 사전 (Krepis-LZ)

- **정적 사전 (Static):** 헥사고날 아키텍처에서 공통으로 발생하는 코드
  패턴(Interface, DTO, Repository 등)을 학습한 사전은 바이너리에 내장합니다.
- **동적 사전 (Dynamic):** 프로젝트별로 자주 쓰이는 커스텀 도메인 용어를
  런타임에 학습하여 세션 동안 압축률을 점진적으로 높이는 하이브리드 방식을
  채택합니다.

### 3.2 플랜별 압축 레벨 제어 (QoS)

- **Free:** 표준 압축 레벨 적용 (CPU 사용 최소화).
- **Pro/Ent:** 고효율 압축 레벨 적용 및 전용 하드웨어 가속(SIMD)을 우선 할당하여
  데이터 전송량을 극대화합니다.

---

## 4. 보안 및 신뢰성 (Security & Reliability)

### 4.1 SIMD 가속 기반 패킷 서명

- **가속 구현:** 모든 패킷 헤더에 박히는 AI 서명 연산을 Rust의 **SIMD(Single
  Instruction, Multiple Data)** 명령어를 통해 병렬 처리합니다. 이를 통해 서명
  추가로 인한 지연 시간을 1ms 미만으로 억제합니다.
- **암호화 로드맵:** 초기에는 `AES-GCM-256`을 사용하며, **양자 내성
  암호(PQC)**는 v2.0.0 이후 표준화 동향에 맞춰 도입을 검토합니다 (v1.x에서는
  안정성 우선).

### 4.2 Context Propagation 및 모니터링

- **헤더 배치:** `traceId`, `tenantId`, `priority` 정보를 QUIC 패킷의 **고정
  헤더(Fixed Header)** 영역 바로 뒤에 배치하여, 페이로드를 복호화하기 전에도
  라우팅 및 필터링이 가능하도록 설계합니다.
- **실시간 대시보드:** CLI TUI(`ratatui`) 및 웹 콘솔을 통해 현재 통신의
  **Latency 그래프, 압축률(Ratio), 패킷 손실률**을 실시간 시각화하여 제공합니다.

---

## 5. 브릿지 인터페이스 (Node.js Addon Bridge)

### 5.1 성능 최적화 비동기 브릿지

- **구현 방식:** Rust에서 수신된 대량의 패킷 데이터를 Node.js의 **Stream
  API(Readable Stream)** 형식으로 노출합니다.
- **이유:** `EventEmitter`보다 메모리 배압(Back-pressure) 제어가 용이하며,
  대용량 데이터를 조각(Chunk) 단위로 처리하는 데 성능상 우위에 있기 때문입니다.

---
