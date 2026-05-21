import { NextRequest, NextResponse } from 'next/server';
import type { Meal } from '@/types/meal';

const neisMealUrl = 'https://open.neis.go.kr/hub/mealServiceDietInfo';

export const dynamic = 'force-dynamic';

type NeisMealRow = {
  MLSV_YMD?: string;
  MMEAL_SC_CODE?: string;
  MMEAL_SC_NM?: string;
  DDISH_NM?: string;
  CAL_INFO?: string;
  NTR_INFO?: string;
  ORPLC_INFO?: string;
};

type NeisMealResponse = {
  mealServiceDietInfo?: [unknown, { row?: NeisMealRow[] }];
  RESULT?: {
    CODE?: string;
    MESSAGE?: string;
  };
};

function getTodayYmd(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());

  const year = parts.find((part) => part.type === 'year')?.value ?? '';
  const month = parts.find((part) => part.type === 'month')?.value ?? '';
  const day = parts.find((part) => part.type === 'day')?.value ?? '';

  return `${year}${month}${day}`;
}

function formatMealDate(value?: string): string {
  if (!value || value.length !== 8) {
    return '오늘';
  }

  return `${value.slice(0, 4)}.${value.slice(4, 6)}.${value.slice(6, 8)}`;
}

function toMealType(row: NeisMealRow): Meal['mealType'] {
  if (row.MMEAL_SC_CODE === '1' || row.MMEAL_SC_NM === '조식') {
    return 'breakfast';
  }

  if (row.MMEAL_SC_CODE === '3' || row.MMEAL_SC_NM === '석식') {
    return 'dinner';
  }

  return 'lunch';
}

function extractAllergyNumbers(items: string[]): string[] {
  return Array.from(new Set(items.flatMap((item) => item.match(/\d+/g) ?? [])));
}

function cleanMenuItem(item: string): string {
  return item
    .replace(/\([^)]*\)/g, '')
    .replace(/\d+(?:\.\d+)*/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseMenuItems(value?: string): string[] {
  return String(value ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(cleanMenuItem)
    .filter(Boolean);
}

function mapMeal(row: NeisMealRow): Meal {
  const rawItems = String(row.DDISH_NM ?? '')
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .filter(Boolean);

  return {
    date: formatMealDate(row.MLSV_YMD),
    mealType: toMealType(row),
    menuItems: parseMenuItems(row.DDISH_NM),
    calorie: row.CAL_INFO,
    nutrition: row.NTR_INFO,
    origin: row.ORPLC_INFO,
    allergyNumbers: extractAllergyNumbers(rawItems),
  };
}

export async function GET(request: NextRequest) {
  const apiKey = process.env.NEIS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ meals: [], error: 'Vercel 환경변수 NEIS_API_KEY가 없습니다.' }, { status: 500 });
  }

  const officeCode = request.nextUrl.searchParams.get('officeCode')?.trim() || '';
  const schoolCode = request.nextUrl.searchParams.get('schoolCode')?.trim() || '';
  const from = request.nextUrl.searchParams.get('from')?.trim() || getTodayYmd();
  const to = request.nextUrl.searchParams.get('to')?.trim() || from;

  if (!/^[A-Z]\d{2}$/.test(officeCode) || !/^\d{7}$/.test(schoolCode)) {
    return NextResponse.json({ meals: [], error: '교육청 코드 또는 학교 코드 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  if (!/^\d{8}$/.test(from) || !/^\d{8}$/.test(to)) {
    return NextResponse.json({ meals: [], error: '조회 날짜 형식이 올바르지 않습니다.' }, { status: 400 });
  }

  const params = new URLSearchParams({
    KEY: apiKey,
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ATPT_OFCDC_SC_CODE: officeCode,
    SD_SCHUL_CODE: schoolCode,
    MLSV_FROM_YMD: from,
    MLSV_TO_YMD: to,
  });

  const response = await fetch(`${neisMealUrl}?${params}`, {
    next: { revalidate: 60 * 60 },
  });

  if (!response.ok) {
    return NextResponse.json({ meals: [], error: 'NEIS 서버에서 급식 정보를 불러오지 못했습니다.' }, { status: 502 });
  }

  const data = (await response.json()) as NeisMealResponse;
  const rows = data.mealServiceDietInfo?.[1]?.row ?? [];

  if (data.RESULT?.CODE?.startsWith('ERROR')) {
    return NextResponse.json({ meals: [], error: data.RESULT.MESSAGE ?? 'NEIS 응답을 처리하지 못했습니다.' }, { status: 502 });
  }

  return NextResponse.json({ meals: rows.map(mapMeal) });
}
