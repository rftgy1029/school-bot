import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import type { WeekdayKey } from '@/types/timetable';

export const weekdayLabels: Record<WeekdayKey, string> = {
  monday: '월요일',
  tuesday: '화요일',
  wednesday: '수요일',
  thursday: '목요일',
  friday: '금요일',
};

const weekdayKeys: Array<WeekdayKey | undefined> = [undefined, 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', undefined];

export function formatKoreanDate(date: Date): string {
  return format(date, 'yyyy년 M월 d일 EEEE', { locale: ko });
}

export function getTodayWeekdayKey(date = new Date()): WeekdayKey | undefined {
  return weekdayKeys[date.getDay()];
}
