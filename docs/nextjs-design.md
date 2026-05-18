# Next.js 학교 급식·시간표 웹앱 설계서

## 1. 목표

학교 급식과 시간표를 모바일에서 빠르게 확인할 수 있는 Next.js 웹앱을 만든다. 첫 버전은 회원가입 없이 브라우저 저장소에 학교·학년·반 설정과 시간표를 저장하고, 급식은 NEIS Open API를 통해 조회한다.

## 2. 핵심 사용자 시나리오

1. 사용자가 웹사이트에 접속한다.
2. 처음 접속한 사용자는 학교, 학년, 반을 설정한다.
3. 메인 화면에서 오늘 급식과 오늘 시간표를 확인한다.
4. 급식 화면에서 오늘, 내일, 주간 급식을 확인한다.
5. 시간표 화면에서 요일별 시간표를 직접 입력하고 확인한다.

## 3. MVP 범위

### 포함 기능

- 학교 설정 저장
- 오늘 급식 조회
- 내일 급식 조회
- 주간 급식 조회
- 요일별 시간표 직접 입력
- 오늘 시간표 표시
- 모바일 반응형 UI
- 다크 모드 대응을 고려한 색상 토큰

### 제외 기능

- 회원가입 및 로그인
- 서버 DB 저장
- 푸시 알림
- 자동 시간표 API 연동
- 여러 학교 프로필 저장

위 기능은 2차 버전에서 확장한다.

## 4. 추천 기술 스택

- Framework: Next.js App Router
- Language: TypeScript
- Styling: Tailwind CSS
- Runtime validation: Zod
- Date handling: date-fns
- State/storage: React state + localStorage
- API integration: Next.js Route Handler에서 NEIS Open API 호출
- Deployment: Vercel

## 5. 정보 구조

```text
/
/settings
/meals
/timetable
```

| 경로 | 목적 |
| --- | --- |
| `/` | 오늘 급식과 오늘 시간표 요약 |
| `/settings` | 학교, 학년, 반, 급식 종류 설정 |
| `/meals` | 오늘·내일·주간 급식 조회 |
| `/timetable` | 요일별 시간표 조회 및 편집 |

## 6. 화면 설계

### 6.1 홈 화면 `/`

홈 화면은 사용자가 가장 자주 보는 화면이다.

구성:

- 상단 인사말과 오늘 날짜
- 학교/학년/반 요약
- 오늘 급식 카드
- 오늘 시간표 카드
- 설정이 없을 때 설정 페이지로 이동하는 CTA

예시:

```text
오늘의 학교생활
2026년 5월 18일 월요일

[오늘 급식]
중식
쌀밥, 미역국, 제육볶음, 배추김치

[오늘 시간표]
1교시 국어
2교시 수학
3교시 영어
```

### 6.2 설정 화면 `/settings`

구성:

- 학교명 입력
- 교육청 코드 입력 또는 선택
- 학교 코드 입력
- 학년 선택
- 반 선택
- 기본 급식 종류 선택
- 저장 버튼

MVP에서는 학교 검색 자동완성 대신 직접 입력을 허용한다. 이후 NEIS 학교 검색 API를 붙여 자동완성으로 개선한다.

### 6.3 급식 화면 `/meals`

구성:

- 날짜 탭: 오늘, 내일, 이번 주
- 급식 카드 목록
- 메뉴, 칼로리, 알레르기 정보
- 데이터가 없을 때 빈 상태 메시지
- API 오류 시 재시도 버튼

### 6.4 시간표 화면 `/timetable`

구성:

- 요일 탭
- 교시별 과목 목록
- 편집 모드
- 저장 버튼

MVP에서는 사용자가 직접 입력한다. NEIS 시간표 API는 학교별 데이터 품질 차이가 있으므로 2차 기능으로 둔다.

## 7. 추천 디렉터리 구조

```text
school-bot
├── app
│   ├── api
│   │   └── meals
│   │       └── route.ts
│   ├── meals
│   │   └── page.tsx
│   ├── settings
│   │   └── page.tsx
│   ├── timetable
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components
│   ├── EmptyState.tsx
│   ├── MealCard.tsx
│   ├── SchoolSettingsForm.tsx
│   └── TimetableCard.tsx
├── lib
│   ├── dates.ts
│   ├── neis.ts
│   ├── storage.ts
│   └── timetable.ts
├── types
│   ├── meal.ts
│   ├── settings.ts
│   └── timetable.ts
└── docs
    └── nextjs-design.md
```

## 8. 주요 데이터 모델

### 8.1 학교 설정

```ts
export type SchoolSettings = {
  schoolName: string;
  educationOfficeCode: string;
  schoolCode: string;
  grade: string;
  classNumber: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
};
```

localStorage key:

```text
school-bot:settings
```

### 8.2 급식

```ts
export type Meal = {
  date: string;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  menuItems: string[];
  calorie?: string;
  nutrition?: string;
  origin?: string;
  allergyNumbers?: string[];
};
```

### 8.3 시간표

```ts
export type Timetable = {
  monday: string[];
  tuesday: string[];
  wednesday: string[];
  thursday: string[];
  friday: string[];
};
```

localStorage key:

```text
school-bot:timetable
```

## 9. API 설계

### 9.1 급식 조회 API

Route Handler:

```text
GET /api/meals?officeCode=B10&schoolCode=7010111&from=20260518&to=20260522
```

처리 흐름:

1. query string 검증
2. 서버에서 NEIS Open API 호출
3. NEIS 응답을 앱 내부 `Meal[]` 형태로 변환
4. 클라이언트에 JSON 응답

응답 예시:

```json
{
  "meals": [
    {
      "date": "2026-05-18",
      "mealType": "lunch",
      "menuItems": ["쌀밥", "미역국", "제육볶음", "배추김치"],
      "calorie": "827.3 Kcal",
      "allergyNumbers": ["1", "5", "6"]
    }
  ]
}
```

### 9.2 환경 변수

```text
NEIS_API_KEY=
```

API 키는 클라이언트로 노출하지 않고 Route Handler에서만 사용한다.

## 10. 컴포넌트 설계

### `MealCard`

역할:

- 급식 날짜와 종류 표시
- 메뉴 목록 표시
- 칼로리와 알레르기 정보 표시

Props:

```ts
type MealCardProps = {
  meal: Meal;
};
```

### `TimetableCard`

역할:

- 특정 요일의 교시별 과목 표시
- 오늘 요일일 때 강조 표시

Props:

```ts
type TimetableCardProps = {
  dayLabel: string;
  subjects: string[];
  isToday?: boolean;
};
```

### `SchoolSettingsForm`

역할:

- 학교 설정 입력
- localStorage 저장
- 저장 후 홈으로 이동

Props:

```ts
type SchoolSettingsFormProps = {
  initialValue?: SchoolSettings;
  onSave: (settings: SchoolSettings) => void;
};
```

## 11. 상태 관리 전략

MVP에서는 별도 전역 상태 라이브러리를 사용하지 않는다.

- 설정: `localStorage` + 커스텀 훅
- 시간표: `localStorage` + 커스텀 훅
- 급식: 서버 API 호출 결과를 페이지 단위 state로 관리

추천 훅:

```text
useSchoolSettings()
useTimetable()
useMeals()
```

## 12. 오류 처리

### 설정 누락

- 홈, 급식, 시간표 화면에서 설정이 없으면 `/settings`로 안내한다.

### 급식 데이터 없음

- “해당 날짜의 급식 정보가 없어요.” 메시지를 보여준다.

### API 오류

- 사용자에게 짧은 오류 메시지와 재시도 버튼을 제공한다.
- 개발자를 위해 서버 로그에는 NEIS 응답 상태와 메시지를 남긴다.

## 13. UI 원칙

- 모바일 우선 레이아웃
- 가장 중요한 정보는 첫 화면 상단에 배치
- 카드형 UI 사용
- 메뉴명은 줄바꿈으로 읽기 쉽게 표시
- 오류 메시지는 친근한 문장으로 표시
- 색상만으로 정보를 구분하지 않고 텍스트 라벨을 함께 사용

## 14. 개발 순서

1. Next.js, TypeScript, Tailwind CSS 초기 세팅
2. 기본 레이아웃과 네비게이션 구현
3. 타입 정의 작성
4. localStorage 유틸 작성
5. 설정 화면 구현
6. 시간표 직접 입력 화면 구현
7. 홈 화면의 오늘 시간표 카드 구현
8. NEIS 급식 API Route Handler 구현
9. 급식 화면 구현
10. 홈 화면의 오늘 급식 카드 구현
11. 빈 상태, 로딩 상태, 오류 상태 정리
12. Vercel 배포 설정

## 15. 2차 확장 아이디어

- 학교 검색 자동완성
- NEIS 시간표 API 연동
- 여러 학교/반 프로필 저장
- 좋아하는 메뉴가 나오는 날 강조
- 알레르기 번호별 설명 표시
- PWA 설치 지원
- 푸시 알림
- Supabase 로그인 및 클라우드 저장
