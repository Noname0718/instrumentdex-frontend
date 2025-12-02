# 🎻 InstrumentDex 프론트엔드

악기에 대한 정보를 탐색하고, 추천 연습곡을 확인하며, 관리자 모드에서 데이터를 손쉽게 관리할 수 있는 싱글 페이지 애플리케이션(SPA)입니다. React Router로 페이지 전환을 처리하고, React Query로 API 캐싱·비동기 상태를 관리해 부드러운 사용자 경험을 제공합니다.

## ✨ 주요 기능
- 악기 도감: 계열(Family)·난이도별 필터링, 태그 보기, 상세 페이지 이동
- 연습곡 목록: 악기, 난이도, 검색어로 필터링하고 곡 상세 페이지에서 유튜브 링크 확인
- 관리자 모드: 악기/곡 데이터를 테이블 형태로 관리하며 CRUD API와 연동
- 공통 UI: 반응형 네비게이션, 이미지 폴백(`InstrumentImage`), 로딩/에러/빈 상태 UX

## 🧱 기술 스택
- React 19 + Vite (rolldown 번들러) + React Router DOM 7
- @tanstack/react-query로 API 호출 상태/캐싱 관리
- Tailwind CSS 기반 커스텀 스타일
- Axios 클라이언트를 이용해 백엔드(`http://localhost:8080/api`)와 통신

## 🚀 실행 방법
```bash
# 0. 저장소 루트 기준
cd instrumentdex-frontend

# 1. 의존성 설치
npm install

# 2. 개발 서버 (기본 포트 5173)
npm run dev

# 3. 프로덕션 번들 생성
npm run build

# 4. 빌드 결과 미리보기
npm run preview
```

> 개발 서버가 백엔드 API(`localhost:8080`)에 접근하므로, Spring Boot 백엔드를 먼저 기동하거나 `src/api/client.js`의 `baseURL`을 실제 배포 주소로 맞춰 주세요.

## 📁 폴더 개요
```
src
├── api/             # Axios 인스턴스 및 악기/곡 전용 API 모듈
├── components/      # 공통 UI (Navbar, InstrumentImage 등)
├── pages/           # 악기/연습곡/관리자 페이지 컴포넌트
├── router/          # BrowserRouter + 라우트 정의
├── assets/          # 정적 자원
└── main.jsx         # React Query Provider 와 Router 마운트
```

## 🔌 백엔드와의 연동 포인트
- 모든 API 호출은 `src/api/client.js`에 정의된 Axios 클라이언트를 거칩니다. 배포 환경에서는 `.env` 혹은 빌드 시 Vite 환경 변수를 이용해 `baseURL`을 재정의할 수 있습니다.
- 백엔드가 제공하는 이미지 정적 경로(`/images/...`)는 InstrumentImage 컴포넌트에서 사용되며, 로딩 실패 시 플레이스홀더를 출력합니다.
- 관리자 페이지의 CRUD 동작은 백엔드 REST API 명세(`instrumentdex-backend/README.md`)를 따르므로, 필드 명세가 바뀌면 양쪽 문서를 함께 업데이트하는 것을 권장합니다.

## 🧪 개선 및 커스터마이징 팁
1. 디자인 확장: Tailwind CSS 4의 `@theme` 블록이나 CSS 변수로 팔레트·타이포그래피를 정의해 브랜드 톤을 반영하세요.
2. 데이터 모킹: 백엔드를 아직 준비하지 못했다면 React Query의 `queryFn` 자리에 `msw`나 JSON Server를 붙여 프론트엔드만 먼저 개발할 수 있습니다.
3. 배포: `npm run build` 출력물(`dist/`)을 Nginx, Vercel, Netlify 등 정적 호스팅 서비스에 업로드하고, 프록시 규칙으로 `/api` 요청을 백엔드에 전달하세요.
