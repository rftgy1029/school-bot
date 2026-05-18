# school-bot

학교 급식과 시간표를 알려주는 Next.js 웹앱 프로젝트입니다.

## 프로젝트 방향

이 프로젝트는 학생이 모바일 웹에서 오늘 급식과 오늘 시간표를 빠르게 확인할 수 있도록 만드는 것을 목표로 합니다.

초기 버전은 다음 기능을 우선 구현합니다.

- 학교, 학년, 반 설정 저장
- 오늘·내일·주간 급식 조회
- 요일별 시간표 직접 입력
- 오늘 급식과 오늘 시간표를 보여주는 홈 화면
- 모바일 반응형 UI

## 기술 스택 제안

- Next.js App Router
- TypeScript
- Tailwind CSS
- NEIS Open API
- localStorage
- Vercel


## 시작하기

이 저장소에는 Next.js App Router 기반의 초기 앱 구조가 포함되어 있습니다.

```bash
npm install
npm run dev
```

개발 서버가 실행되면 `http://localhost:3000`에서 웹앱을 확인할 수 있습니다.

## 설계 문서

자세한 Next.js 앱 설계는 [`docs/nextjs-design.md`](docs/nextjs-design.md)를 참고하세요.
