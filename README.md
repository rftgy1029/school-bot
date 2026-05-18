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

처음 실행하거나 저장소를 새로 받은 뒤에는 의존성을 먼저 설치해야 합니다. `next: not found` 오류가 나오면 아직 `node_modules`가 설치되지 않은 상태입니다.

```bash
npm install
npm run dev
```

개발 서버가 실행되면 `http://localhost:3000`에서 웹앱을 확인할 수 있습니다.

## 자주 나는 오류

### `sh: 1: next: not found`

`npm run dev`가 `package.json`의 `next dev` 스크립트를 실행했지만, 로컬 의존성 폴더인 `node_modules`에 Next.js가 없을 때 발생합니다. 아래 명령어로 의존성을 설치한 뒤 다시 실행하세요.

```bash
npm install
npm run dev
```

설치가 계속 실패하면 Node.js 버전을 확인하고, npm 캐시와 기존 설치물을 지운 뒤 다시 설치합니다.

```bash
node --version
npm --version
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### `Couldn't find a pages directory` 또는 React/Next 버전 충돌

이 앱은 `app/` 디렉터리를 사용하는 Next.js App Router 프로젝트입니다. Next.js 9 같은 오래된 버전이 설치되면 `pages` 디렉터리를 찾는 오류가 나거나 React 19와 peer dependency 충돌이 발생합니다.

`package.json`은 Next.js `15.3.0`, React `19.0.0`을 정확한 버전으로 고정합니다. 오래된 `node_modules`나 `package-lock.json`이 남아 있다면 아래처럼 지우고 다시 설치하세요.

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

그래도 npm이 `next@9.x`를 설치하려고 한다면 현재 파일이 최신인지 확인하세요. `package.json`의 `next` 값은 반드시 `15.3.0`이어야 합니다. 에러 메시지에 `next@"^9.3.3" from the root project`가 보이면 현재 작업 폴더의 `package.json`이 오래된 상태입니다.

```bash
git pull
npm run doctor
npm run clean:deps
npm install
npm run dev
```

`npm run doctor`는 `package.json`, `package-lock.json`, 설치된 `node_modules/next` 버전이 App Router용 버전과 맞는지 확인합니다.

### `Configuring Next.js via 'next.config.ts' is not supported`

일부 Next.js 버전에서는 TypeScript 설정 파일인 `next.config.ts`를 읽지 못합니다. 이 프로젝트는 호환성을 위해 CommonJS 형식의 `next.config.js`를 사용합니다.

## 설계 문서

자세한 Next.js 앱 설계는 [`docs/nextjs-design.md`](docs/nextjs-design.md)를 참고하세요.
