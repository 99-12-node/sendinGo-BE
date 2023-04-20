# ✨SendinGo | 쉽고 빠른 알림톡 대량 발송 서비스

![SendinGo 메인홈](https://user-images.githubusercontent.com/121853931/233304202-48859725-6fcc-470d-bf53-b69d1a2b127a.jpg)

### 👉[SendinGo 사용해보기][sendingo-link]

[sendingo-link]: https://www.sendingo.site/ 'SendinGo 바로가기!'

## <br>

## [목차](#contents)

### [Tools](#tools)

### [주요기능](#주요기능)

### [ERD](#sendingo-erd)

## 🛠 Tools

![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
<img src="https://img.shields.io/badge/express-000000?style=for-the-badge&logo=express&logoColor=white">
<img src="https://img.shields.io/badge/docker-2496ED?style=for-the-badge&logo=docker&logoColor=white">
<img src="https://img.shields.io/badge/-axios-black?style=for-the-badge&logo=axios&logoColor=white"/>&nbsp;
<img src="https://img.shields.io/badge/-Nginx-green?style=for-the-badge&logo=Nginx&logoColor=white">
![Jest](https://img.shields.io/badge/Jest-C21325?style=for-the-badge&logo=Jest&logoColor=white)
<img src="https://img.shields.io/badge/JSON Web Tokens-000000?style=for-the-badge&logo=JSON Web Tokens&logoColor=white">
<img src="https://img.shields.io/badge/-winston-green?style=for-the-badge&logo=winston&logoColor=white"/>&nbsp;
<br>
<img src="https://img.shields.io/badge/-amazonec2-FF9900?style=for-the-badge&logo=amazonec2&logoColor=white"/>&nbsp;
<img src="https://img.shields.io/badge/-redis-red?style=for-the-badge&logo=redis&logoColor=white"/>&nbsp;
<img src="https://img.shields.io/badge/-AWS ElastiCache-2962FF?style=for-the-badge&logo=AWS ElastiCache&logoColor=white"/>&nbsp;
<img src="https://img.shields.io/badge/-amazon cloudwatch-5BA745?style=for-the-badge&logo=amazon cloudwatch&logoColor=white"/>&nbsp;
<img src="https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white">
<img src="https://img.shields.io/badge/githubactions-2088FF.svg?style=for-the-badge&logo=githubactions&logoColor=white">
<img src="https://img.shields.io/badge/-amazons3-EB001B?style=for-the-badge&logo=amazons3&logoColor=white"/>&nbsp;
<img src="https://img.shields.io/badge/-AWS CodeDeploy-5BA745?style=for-the-badge&logo=AWS CodeDeploy&logoColor=white"/>&nbsp;
<br>
<img src="https://img.shields.io/badge/-sequelize-blue?style=for-the-badge&logo=Sequelize&logoColor=white"/>&nbsp;
<img src="https://img.shields.io/badge/-mysql-blue?style=for-the-badge&logo=Mysql&logoColor=white"/>&nbsp;
<img src="https://img.shields.io/badge/-amazonrds-527FFF?style=for-the-badge&logo=amazonrds&logoColor=white"/>&nbsp;

<br>

---

## ⭐ **주요 기능**

- ## **엑셀 파일 업로드 - 고객등록** <br>

  - 엑셀 파일로 업로드하여 다량 고객 등록
  - 원하는 템플릿 내용 설정
  - 템플릿 파일에서 행 데이터 선택 삭제

- ## **고객 그룹 관리 및 대량 발송** <br>

  - 그룹 선택없이 고객 등록시 미지정 그룹으로 자동 저장
  - 그룹내 고객 추가, 삭제, 복사, 이동 기능
  - 그룹 추가, 그룹 삭제로 목적에 맞게 고객을 그룹화하여 관리
  - 그룹을 선택하면 알림톡 전송 버튼이 활성화됨

- ## **전송 템플릿 설정** <br>

  - 템플릿 설정 후 미리보기로 전송 내용 확인
  - 링크 주소 입력하여 고객에게 버튼이 포함된 알림톡 일괄 발송

- ## **전송 결과 조회** <br>

  - 그룹별로 발송상태(전송완료/실패)여부 확인 가능
  - 전송 상세 조회에서 개별 건 단위의 수신자 번호, 발송 메시지 내용, 발송일, 발송상태 표시 확인 가능

- ## **전송 결과 통계** <br>

  - 현재 기준 실시간 통계 데이터(고객수, 그룹수, 전송 성공률, 클릭률)를 조회 가능
  - 시간별 통계 데이터를 시각화하여 현황 파악

---

<details>
<summary>📝ERD 보기</summary></br>
<div markdown="1">

![sendinGo-ERD (1)](https://user-images.githubusercontent.com/121853931/233146073-8f975088-f2a6-49ff-8f45-256fd7efc81e.png)

</div>
</details>

## SendinGo ERD<a name="sendingo-erd"></a>

---

## 🛠 Architecture

![sending-서비스-아키텍처 jpg](https://user-images.githubusercontent.com/121853931/233131984-3a66adee-8880-41f5-8691-820c0f2c397e.jpg)

---

## 🔥이슈 및 트러블슈팅

<details>
<summary><b>[BE]외부 알림톡 API와의 연동을 위한 비즈니스 로직 설계</b></summary> <br/>
    
> **요구사항**

- 고객이 전송 버튼을 누르면, 외부 알림톡 전송 API 에 요청을 보내야 함
- 전송상태가 실시간으로 반영되면서 지속적인 외부 API 와의 상호작용이 필요함

> **문제사항**

- 프론트엔드에서 바로 알림톡 요청을 보낼지, 혹은 백엔드를 거쳐 알림톡 요청을 보낼지 통제권을 어디에 두어야 할지
- 외부 API 에서 받아온 값을 바로 프론트엔드에 보내 주고 DB에 저장할지, 혹은 외부API응답값을 DB에 저장한 뒤 프론트엔드 요청에 대한 응답으로 반환할지

> **해결방향**

- 시퀀스 다이어그램을 통해 각각의 장단점을 비교 분석
  ![BE 주도 시퀀스 다이어그램 jpg](https://user-images.githubusercontent.com/121853931/233253290-546b0f4f-d6b5-49c0-8bd1-be68d23914d6.jpg)
  ![FE 주도 시퀀스 다이어그램 jpg](https://user-images.githubusercontent.com/121853931/233253349-cf01b8f6-2cdb-4563-9347-2ad635b07818.jpg)

- Redis를 통해 자주 변하는 데이터를 저장해두고 비교적 변하지 않는 값을 DB에 저장하는 형태로 쿼리 요청을 최소화

> **의견결정**

- 전송 상태만을 위해 Redis 서버를 만들긴 어렵기 때문에 ElastiCache를 통해 서버 관리 로드를 축소
- axios를 활용한 리다이렉트로 자체 로직과 외부 요청이 순차적으로 진행되도록 처리

</details>

<details>
<summary><b>[BE]버튼 클릭으로 트래킹</b></summary><br/>
  
> **요구사항**

- 고객이 알림톡 버튼을 누르면, 로그 데이터가 생성되는 식으로 클릭률을 트래킹 시도
- 알리고 전송 API를 보내기 전에, 회원이 입력값 URL 을 redirect 최종 경로로 등록하기 위해 우리측에서 식별 가능한 값을 미리 만들어 URI를 심어야 함

> **문제사항**

- 어떤 값을 식별자로 사용할 것인가 - 각 엔티티마다 가지고 있는 ID를 포함하는 임시 uuid
- URL 에 쿼리, 파라미터, 별도의 식별자 중 어떤 형태로 식별 값을 넣을 것인가
- 해당 식별 값에 어떤 데이터베이스를 활용해야 할 것인가

> **해결방안**

- MySQL : 각 테이블마다 관계가 이미 일관되고 JOIN 등으로 여러 테이블을 참조해야 하기 때문에 응답 시간 및 복잡도가 늘어남
- Redis : 세션 Id 처럼 해당 값을 키:값 형태로 저장할 수 있는 가벼운 NoSQL 데이터베이스
- MongoDB : 식별값만 저장해야 하기 때문에, 해당 목적만으로 적용하기엔 무겁다고 판단

> **의사결정**

- 전송 전 / 전송 / 결과 조회 등의 여러 이벤트 흐름마다 해당 키의 값을 업데이트 해야 하기 때문에 빠른 조회가 가능한 인메모리 데이터베이스 채택
</details>

<details>
<summary><b>[BE]배포 자동화</b></summary><br/>
  
> **요구사항**

- 소스 코드 변화가 있을 때마다 배포를 위해 단순 반복 작업을 수행하는 것에 대한 비효율성

> **해결방향**

- Jenkins : 다양한 기능을 제공하나, 단기간에 숙달하기에는 필요한 사전 지식이 많이 필요
- Github Action : GitHub과 통합된 환경을 제공하고 사용이 빠르고 쉬움

> **의사결정**

- 초기 인프라 구축에 시간을 최소화하는 것이 기능 개발 시간을 효율적으로 사용할 수 있다고 판단.
- 배포 자동화를 단기간에 진행하기 위해 빠르고 어렵지 않게 다룰 수 있는 Github Action으로 선택

</details>
<details>
<summary><b>[BE]그룹에 속하지 않은 고객관리</b></summary><br/>
  
> **문제사항**

- 그룹 전체 목록에서 그룹에 속하지 않은 고객들이 조회되지 않아 인원수 차이가 발생함

> **해결방향**

- ERD 및 정책 변경 : 모든 클라이언트들은 그룹에 속하도록 처리
- 정책 유지 및 API 변경 : 그룹 미지정 클라이언트들만 따로 DB에서 조회하여 전체 조회 API 에 추가

> **의사결정**

- 서비스 정책을 변경하는 것이 API 확장성과 복잡도에 비해 시간과 노력이 덜 듦
- 우리가 원하는 것은 ‘그룹 미지정’ 이라는 개념이기 때문에 그룹의 형태를 차용하기로 함.

> **개선 및 보완**

- 최초 회원가입시 미지정 그룹 생성
- 그룹을 등록 안하는 고객 대량 생성, 고객 단건 생성 할 때 자동으로 미지정 그룹에 저장되도록 구현
- 같은 이름의 그룹이 존재할 경우 ‘그룹명(숫자)’ 형태로 추가되도록 변경

</details>

---

## 👨‍👩‍👧 작업 구성원

| 역할       | 이름   | 분담                                                                                 | 깃허브                            |
| ---------- | ------ | ------------------------------------------------------------------------------------ | --------------------------------- |
| BE(리더)   | 남혜민 | 고객 대량 생성 및 다건 발송, 통계, 템플릿, 알림톡 전송 및 결과, 트랙킹, CI/CD        | https://github.com/minenam        |
| BE         | 설연주 | 고객 단건 CRUD, 그룹 CRUD, 고객-그룹 CRUD, Swagger                                   | https://github.com/Ryeonjoo       |
| BE         | 이승운 | 회원가입, 로그인                                                                     | https://github.com/Leeseungwoon12 |
| FE(부리더) | 김영현 | 고객 대량 생성, 알림톡 전송 및 결과, 템플릿 미리보기, 회원가입 및 로그인 개편, CI/CD | https://github.com/0hyeon         |
| FE         | 장은빈 | 고객 단건 CRUD, 그룹 CRUD 고객-그룹 관리, 통계                                       | https://github.com/EUNBINs        |
| FE         | 양진규 | 회원가입, 로그인, 설문조사, UT                                                       | https://github.com/jjolraman      |
