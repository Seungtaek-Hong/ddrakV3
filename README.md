# 화요뜨락 (ddrak)

성균관대학교 화요뜨락 시간표/일정 등록 사이트입니다. 각 동아리가 정기 모임 시간과 이벤트를 등록하고, 전체 동아리 일정을 한눈에 확인할 수 있습니다.

- 배포 주소: https://ddrak.vercel.app
- 원본 저장소: [jaepang/ddrakV3](https://github.com/jaepang/ddrakV3)

## 🙏 Credit

이 프로젝트는 **악의꽃 32기 신재광(jaepang)** 선배님이 처음 만들고 여러 동아리가 함께 쓸 수 있도록 운영해주신 서비스입니다. 화요뜨락이 지금까지 이어져 올 수 있었던 건 전적으로 재광 선배님 덕분입니다. 이 자리를 빌려 감사드립니다.

이후 서비스 사용량 증가로 기존 DB(Neon Postgres) 무료 할당량이 월말마다 초과되어 로그인이 안 되는 문제가 반복되었고, 이를 계기로 악의꽃 39기 홍승택이 후속 관리를 맡아 이 저장소로 이관했습니다. 도메인(`ddrak.vercel.app`)도 선배님께서 직접 넘겨주셔서 기존 주소 그대로 운영되고 있습니다.

## 🐛 버그 수정

- **다음 달 일정이 보이지 않던 문제**: 오늘이 9월이면 오른쪽 미니 캘린더를 직접 10월로 옮겨야만 10월 일정이 보였음. 이벤트 조회 범위 계산이 한 달 모자랐던 버그(`useCalendarDataQuery.ts`)로, 미니 캘린더를 옮기지 않아도 다음 달 일정이 바로 반영되도록 수정
- **모바일에서 오전/오후(AM/PM) 선택이 보이지 않던 문제**: 모바일 화면에서는 시간 선택 UI가 24시간제로만 표시되어 PC와 경험이 달랐음. 모바일에서도 PC와 동일하게 오전/오후 토글이 보이도록 수정하고, 좁은 화면에서 잘리지 않게 가로 스크롤 처리 추가 (360px 너비까지 검증)
- **게스트 상태에서 불필요한 DB 쿼리가 호출되던 문제**: 로그인하지 않은 방문자도 캘린더 데이터 쿼리를 호출하고 있었음. 불필요한 DB 사용량의 원인이라 수정

## ✨ 기능 변경

- **로그인 직후 바로 동아리 시간표 표시**: 기존엔 로그인해도 "전체" 화면이 기본으로 떠서 "동아리" 버튼을 따로 눌러야 시간표가 보였는데, 이 전환 토글을 없애고 바로 동아리 시간표로 진입하도록 변경
- **계정 관리 기능 추가**: 최고 관리자(SUPER)가 사용자를 선택해 비밀번호를 강제로 재설정할 수 있는 페이지 추가 (비밀번호 분실 대응용)
- **대여 등록 메뉴 제거**: 사용 빈도가 낮았던 동아리 관리자용 "대여 등록" 메뉴 버튼 제거

## 📊 인프라 / 운영

- **DB 플랜**: Neon Free 플랜(월 100 CU-hours) 유지 중. 한도를 초과하면 다음 결제 주기까지 DB compute가 중단되어 로그인이 불가능해지므로, 사용량을 주기적으로 모니터링하고 있음
- **Autoscale 상한 조정**: 컴퓨트 오토스케일 상한을 2 CU → 1 CU로 낮춰 트래픽 급증 시 사용량이 과도하게 늘어나는 것을 방지
- **Scale to zero 유지**: 미사용 시 컴퓨트가 자동으로 내려가도록 유지해 유휴 시간대 사용량을 최소화

### 사용량 추이

| 기간 | 사용량 | 비고 |
|---|---|---|
| 2026년 9월 (이관 전) | 22일 만에 100 CU-hours 소진 | 한도 초과로 서비스 중단 |
| 2026년 10월 | 월 환산 약 21 CU-hours | 한도의 약 21% |
| 2026년 11월 (15일 기준) | 월 환산 약 44 CU-hours | 한도의 약 44% |

이관 이후 한도 내에서 안정적으로 운영되고 있습니다. 다만 사용량이 증가하는 추세이므로, 한도에 근접할 경우 종량제(Launch) 플랜 전환을 검토할 예정입니다.

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

```
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
APP_SECRET=
NEXT_PUBLIC_API_PATHNAME=/api/graphql
```

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
