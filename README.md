# BIDCAST APP 코드 입니다.

### [BIDCAST 서버](https://github.com/KR-HS/BidCast_Server)
### [BIDCAST 홈페이지](https://bidcast.kro.kr)
---
+ **BIDCAST**는 **실시간 방송 플랫폼에 경매를 접목 시킨 프로젝트**입니다.
+ **경매일정, 경매검색**을 통해 원하시는 **경매를 검색**할 수 있습니다.
+ **관심경매**를 등록하여 마이페이지에서 빠르게 원하는 경매페이지로 이동할 수 있습니다.
+ **홈페이지, 경매검색, 경매일정**에서 하단의 메뉴바를 통해 **경매를 개설**할 수 있습니다. 
+ 경매사, 입찰자를 따로 구분하지 않으며 **누구나 경매를 개설**할 수 있습니다.
+ **경매사**는 **경매물품을 낙찰 또는 유찰** 시킬수 있으며, **경매단위를 변경**할 수 있습니다.
+ 경매사가 **입찰 종료버튼**을 누르게 되면 해당 경매페이지에서 **입찰자는 더이상 입찰기능을 사용할 수 없습니다.** (입찰 기능 외 영상공유 및 채팅은 이용가능합니다.)
+ **입찰자**는 **경매물품을 입찰**할 수 있으며 낙찰 또는 유찰시 안내 모달을 통해 확인할 수 있습니다.
> + 입찰자가 영상을 송출중이라면 화면을 통해서도 확인할 수 있습니다.
+ 경매사, 입찰자는 해당 경매페이지내에서 서로간의 **채팅**을 할 수 있으며 이는 채팅창으로 최근 40개까지의 채팅내역을 확인할 수 있습니다.   
+ **마이페이지**에서 **본인의 경매이력과 낙찰내역을 확인**할 수 있으며, 해당 경매에서 **등록한 물품의 상태를 확인**할 수 있습니다.


+ Vite기반 프로젝트로 멀티페이지뷰로 구현하였습니다.
+ 파일을 저장하는 **클라우드로 S3**를 사용하였고, **RDS에 PostgreDB**를 설치하여 사용하였습니다. 또한 보안을 위해 **JWT**를 이용하여 **비밀번호를 암호화**하였습니다.
> + **현재 깃에는 DB와 RDS, JWT를 등록하는 ``application-custom.properties가 제외``되어있습니다.**
>> + **``application-custom.properties``**`를 ``src/main/resources``에 추가해주세요.
>>> ```
>>> spring.datasource.url= DB주소
>>> spring.datasource.username= DB사용자이름
>>> spring.datasource.password= DB패스워드
>>> 
>>> 
>>> jwt.secret= 사용자지정 비밀 키
>>> jwt.expiration=3600000 (만료시간 - 현재 1시간)
>>> 
>>> aws.s3.access-key= S3 접근 키
>>> aws.s3.secret-key= S3 비밀키
>>> aws.s3.region= region값
>>> aws.s3.bucket= 버킷 이름
>>> aws.s3.folder= 파일을 저장할 폴더명
>>> ```
+ 현재 홈페이지는 EC2를 기반으로 하여 작동중이며 Nginx와 certbot을 이용하여 도메인을 연결하였고, Jenkins를 이용하여 CI/CD를 구현하였습니다.



+ **사용 기술**

> ### 1. Server
> #### 1-1. App Server (유저 서비스)
> - **Build Tools**: `Vite`, `Gradle`
> - **Front-End**: `React`, `HTML`, `CSS`, `Thymeleaf`
> - **Back-End**: `Spring Boot`, `WebRTC`, `WebSocket`
> - **Persistence**: `mybatis`
> - **Authorization**: `JWT`, `Spring Security`
>
> #### 1-2. SFU Server (중계 서버)
> - `Node.js`, `WebRTC`, `WebSocket`
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
