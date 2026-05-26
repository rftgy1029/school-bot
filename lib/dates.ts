import type { WeekdayKey } from '@/types/timetable';

export const weekdayLabels: Record<WeekdayKey, string> = {
  monday: '월요일',
  tuesday: '화요일',
  wednesday: '수요일',
  thursday: '목요일',
  friday: '금요일',
};

const seoulTimeZone = 'Asia/Seoul';
const weekdayKeys: Array<WeekdayKey | undefined> = [undefined, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', undefined];

function getSeoulDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: seoulTimeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(date);

  const year = Number(parts.find((part) => part.type === 'year')?.value ?? '0');
  const month = Number(parts.find((part) => part.type === 'month')?.value ?? '1');
  const day = Number(parts.find((part) => part.type === 'day')?.value ?? '1');

  return { year, month, day };
}

function toYmd(date: Date): string {
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');

  return `${year}${month}${day}`;
}

function getSeoulCalendarDate(date = new Date()): Date {
  const { year, month, day } = getSeoulDateParts(date);
  return new Date(Date.UTC(year, month - 1, day));
}

export function formatKoreanDate(date: Date): string {
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: seoulTimeZone,
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date);
}

export function getTodayWeekdayKey(date = new Date()): WeekdayKey | undefined {
  return weekdayKeys[getSeoulCalendarDate(date).getUTCDay()];
}

export function getTodayYmdInSeoul(date = new Date()): string {
  return toYmd(getSeoulCalendarDate(date));
}

export function getTomorrowYmdInSeoul(date = new Date()): string {
  const calendarDate = getSeoulCalendarDate(date);
  calendarDate.setUTCDate(calendarDate.getUTCDate() + 1);
  return toYmd(calendarDate);
}

export function getCurrentWeekRangeYmdInSeoul(date = new Date()) {
  const base = getSeoulCalendarDate(date);
  const weekday = base.getUTCDay();
  const diffToMonday = weekday === 0 ? -6 : 1 - weekday;

  const monday = new Date(base);
  monday.setUTCDate(monday.getUTCDate() + diffToMonday);

  const friday = new Date(monday);
  friday.setUTCDate(friday.getUTCDate() + 4);

  return {
    from: toYmd(monday),
    to: toYmd(friday),
  };
}
