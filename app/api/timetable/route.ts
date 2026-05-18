import { NextRequest, NextResponse } from 'next/server';

const neisTimetableUrl = 'https://open.neis.go.kr/hub/hisTimetable';
const educationOfficeCode = 'G10';
const schoolCode = '7430059';

export const dynamic = 'force-dynamic';

type NeisTimetableRow = {
  ALL_TI_YMD?: string;
  GRADE?: string;
  CLASS_NM?: string;
  PERIO?: string;
  ITRT_CNTNT?: string;
};

type NeisTimetableResponse = {
  hisTimetable?: [unknown, { row?: NeisTimetableRow[] }];
  RESULT?: {
    CODE?: string;
    MESSAGE?: string;
  };
};

function getKoreanDateParts() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = Number(parts.find((part) => part.type === 'year')?.value ?? new Date().getFullYear());
  const month = Number(parts.find((part) => part.type === 'month')?.value ?? new Date().getMonth() + 1);
  const day = parts.find((part) => part.type === 'day')?.value ?? '';

  return {
    year,
    month,
    ymd: `${year}${String(month).padStart(2, '0')}${day}`,
  };
}

function getAcademicYearAndSemester() {
  const { year, month } = getKoreanDateParts();

  if (month <= 2) {
    return { academicYear: String(year - 1), semester: '2' };
  }

  return {
    academicYear: String(year),
    semester: month >= 9 ? '2' : '1',
  };
}

function toSubjects(rows: NeisTimetableRow[]): string[] {
  return rows
    .slice()
    .sort((left, right) => Number(left.PERIO ?? 0) - Number(right.PERIO ?? 0))
    .map((row) => row.ITRT_CNTNT?.trim() ?? '')
    .filter(Boolean);
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEIS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ subjects: [], error: 'Vercel 환경변수 NEIS_API_KEY가 없습니다.' }, { status: 500 });
  }

  const grade = request.nextUrl.searchParams.get('grade') || '2';
  const classNumber = request.nextUrl.searchParams.get('classNumber') || '1';
  const { ymd } = getKoreanDateParts();
  const { academicYear, semester } = getAcademicYearAndSemester();

  const params = new URLSearchParams({
    KEY: apiKey,
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ATPT_OFCDC_SC_CODE: educationOfficeCode,
    SD_SCHUL_CODE: schoolCode,
    AY: academicYear,
    SEM: semester,
    ALL_TI_YMD: ymd,
    GRADE: grade,
    CLASS_NM: classNumber,
  });

  const response = await fetch(`${neisTimetableUrl}?${params}`, {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    return NextResponse.json({ subjects: [], error: 'NEIS 서버에서 시간표 정보를 불러오지 못했습니다.' }, { status: 502 });
  }

  const data = (await response.json()) as NeisTimetableResponse;
  const rows = data.hisTimetable?.[1]?.row ?? [];

  if (data.RESULT?.CODE?.startsWith('ERROR')) {
    return NextResponse.json({ subjects: [], error: data.RESULT.MESSAGE ?? 'NEIS 응답을 처리하지 못했습니다.' }, { status: 502 });
  }

  return NextResponse.json({
    date: ymd,
    grade,
    classNumber,
    subjects: toSubjects(rows),
  });
}
