# BIDCAST APP 입니다.

## 🎥 실시간 방송(WebRTC)을 활용한 온라인 경매 플랫폼
**BIDCAST**는 누구나 경매를 개설하고 입찰에 참여할 수 있는 실시간 영상 기반 경매 시스템입니다.  
실시간 채팅, 영상 공유, 입찰 기능을 통해 생동감 있는 경매 경험을 제공합니다.

🔗 [BIDCAST 서버 GitHub](https://github.com/KR-HS/BidCast_Server)
🔗 [BIDCAST 클라이언트 GitHub](https://github.com/KR-HS/BidCast) 
🌐 [BIDCAST 홈페이지](https://bidcast.kro.kr)

---

### 🔧 주요 기능
- **경매 탐색**: 경매 일정과 검색 기능을 통해 원하는 경매를 손쉽게 찾을 수 있습니다.
- **관심 경매 등록**: 마이페이지에서 관심 경매로 바로 이동할 수 있습니다.
- **경매 개설**: 누구나 경매사가 되어 경매를 개설할 수 있습니다.
- **경매 진행 기능**:
  - 경매사는 실시간 방송을 통해 입찰을 진행하고, 물품을 낙찰/유찰 처리할 수 있습니다.
  - 경매 단위 조정 및 입찰 종료 기능을 제공합니다.
- **입찰자 기능**:
  - 실시간 입찰, 낙찰/유찰 결과를 모달 및 영상을 통해 확인할 수 있습니다. 
  - 실시간 채팅기능을 구현하였습니다. (최근 40개 메시지 유지)
- **마이페이지**:
  - 경매 이력, 낙찰 내역, 등록 상품 상태 등을 확인할 수 있습니다.

---
### 📦 프로젝트 구성 및 배포
- **Vite 기반 멀티 페이지 구성**
- **EC2 배포**, **Nginx + certbot으로 HTTPS** 설정
- **Jenkins**를 통한 **CI/CD 구축**
- **AWS S3**를 통한 파일 저장
- **PostgreSQL (RDS)** 기반 데이터베이스 사용
- **JWT**를 통한 인증 및 **비밀번호 암호화** 적용
> ⚠️ **주의**: `application-custom.properties` 파일은 Git에 포함되지 않습니다.
> *직접 `src/main/resources` 경로에 아래 내용을 포함한 파일을 추가해주세요:*

<details>
<summary><code>application-custom.properties</code> 예시 보기</summary>

```
properties
spring.datasource.url=jdbc:postgresql://<DB주소>:5432/bidcast
spring.datasource.username=<DB유저>
spring.datasource.password=<DB비밀번호>

jwt.secret=<JWT 비밀 키>
jwt.expiration=3600000

aws.s3.access-key=<AccessKey>
aws.s3.secret-key=<SecretKey>
aws.s3.region=ap-northeast-2
aws.s3.bucket=<버킷명>
aws.s3.folder=uploads
```
</details> 

---

### 🛠 사용 기술 스택

> ### 1. Server
> #### 1-1. App Server (유저 서비스)
> - **Build Tools**: `Vite`, `Gradle`
> - **Front-End**: `React`, `HTML`, `CSS`, `Thymeleaf`
> - **Back-End**: `Spring Boot`, `WebRTC`, `WebSocket`
> - **Persistence**: `MyBatis`
> - **Authorization**: `JWT`, `Spring Security`
>
> #### 1-2. SFU Server (중계 서버)
> - `Node.js`, `WebRTC`, `mediasoup`, `WebSocket`
>
> #### 1-3. Database
> - `Amazon RDS`, `PostgreSQL`
>
> #### 1-4. Cloud Storage
> - `Amazon S3`

> ### 2. Infrastructure
> - `Nginx`, `certbot`, `Let's Encrypt`

> ### 3. Dev Tools
> - `IntelliJ IDEA`, `Figma`

> ### 4. Collaboration
> - `Git`, `GitHub`

> ### 5. CI/CD
> - `Jenkins`
