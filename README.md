# 화요뜨락 (ddrak)

성균관대학교 화요뜨락 시간표/일정 등록 사이트입니다. 각 동아리가 정기 모임 시간과 이벤트를 등록하고, 전체 동아리 일정을 한눈에 확인할 수 있습니다.

- 배포 주소: https://ddrak2.vercel.app *(기존 ddrak.vercel.app 도메인 이관 전까지 임시 주소로 운영 중)*
- 원본 저장소: [jaepang/ddrakV3](https://github.com/jaepang/ddrakV3)

## 🙏 Credit

이 프로젝트는 **32기 신재광(jaepang)** 선배님이 처음 만들고 여러 동아리가 함께 쓸 수 있도록 운영해주신 서비스입니다. 화요뜨락이 지금까지 이어져 올 수 있었던 건 전적으로 재광 선배님 덕분입니다. 이 자리를 빌려 감사드립니다.

이후 서비스 사용량 증가로 기존 DB(Neon Postgres) 무료 할당량이 월말마다 초과되어 로그인이 안 되는 문제가 반복되었고, 이를 계기로 악의꽃 39기 홍승택이 후속 관리를 맡아 이 저장소로 이관했습니다.

## 🔧 v3에서 달라진 점

### 기능
- **로그인 직후 바로 동아리 시간표가 보이도록 개선**: 기존엔 로그인해도 "전체" 화면이 기본으로 떠서 "동아리" 버튼을 따로 눌러야 시간표가 보였는데, 이 전환 토글을 없애고 바로 동아리 시간표로 진입하도록 수정
- **대여 등록 메뉴 제거**: 사용 빈도가 낮았던 동아리 관리자용 "대여 등록" 메뉴 버튼 제거

### 인프라 / 안정성
- **DB 쿼리 최적화**: 로그인하지 않은 방문자(게스트)도 캘린더 데이터 쿼리가 불필요하게 호출되던 버그를 수정
- **Neon 플랜을 Free → Launch(종량제)로 전환**: 기존에는 월 무료 할당량(100 CU-hours)을 초과하면 다음 달까지 DB 자체가 잠기며 로그인이 완전히 불가능했음. Launch 플랜으로 전환해 사용량이 몰려도 서비스가 중단되지 않도록 구조적으로 해결
- **Autoscale 상한 설정 및 지출 알림 설정**: 예기치 못한 트래픽 폭주로 비용이 급격히 늘어나는 것을 방지

## 🛠 기술 스택

- **Frontend**: Next.js 12, React 18, Recoil, React Query, FullCalendar
- **Backend**: Next.js API Routes, Apollo Server (apollo-server-micro), GraphQL, Nexus
- **Database**: PostgreSQL (Neon), Prisma ORM
- **Deploy**: Vercel

## 🚀 프로젝트 설정

```bash
git clone https://github.com/Seungtaek-Hong/ddrakV3.git
cd ddrakV3
yarn install
yarn generate
```

`.env` 파일에 아래 값들을 설정해야 합니다:

POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
APP_SECRET=
NEXT_PUBLIC_API_PATHNAME=/api/graphql


## 🧪 로컬 실행 (개발)

```bash
yarn dev
```

## 📦 빌드 & 배포

```bash
# build
yarn build
# deploy
yarn next
```

실제 배포는 Vercel과 GitHub 저장소가 연동되어 있어, `main` 브랜치에 push하면 자동으로 배포됩니다.

## 📄 라이선스

MIT
