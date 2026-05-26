'use client';

import { useCallback, useEffect, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { TimetableCard } from '@/components/TimetableCard';
import { getTodayWeekdayKey, getTodayYmdInSeoul, weekdayLabels } from '@/lib/dates';
import type { Timetable } from '@/types/timetable';

type TimetableResponse = {
  subjects?: string[];
  error?: string;
};

type TimetableSectionProps = {
  grade: string;
  classNumber: string;
  officeCode: string;
  schoolCode: string;
  source: 'neis' | 'local';
  localTimetable?: Timetable;
};

export function TimetableSection({ grade, classNumber, officeCode, schoolCode, source, localTimetable }: TimetableSectionProps) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(source === 'neis');
  const todayKey = getTodayWeekdayKey();

  const loadTimetable = useCallback(async () => {
    if (source === 'local') {
      setError(null);
      setIsLoading(false);

      if (!todayKey || !localTimetable) {
        setSubjects([]);
        return;
      }

      setSubjects(localTimetable[todayKey] ?? []);
      return;
    }

    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        grade,
        classNumber,
        officeCode,
        schoolCode,
        date: getTodayYmdInSeoul(),
      });
      const response = await fetch(`/api/timetable?${params}`, { cache: 'no-store' });
      const data = (await response.json()) as TimetableResponse;

      if (!response.ok) {
        throw new Error(data.error ?? '시간표 정보를 불러오지 못했습니다.');
      }

      setSubjects(data.subjects ?? []);
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : '시간표 정보를 불러오지 못했습니다.');
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  }, [source, todayKey, localTimetable, grade, classNumber, officeCode, schoolCode]);

  useEffect(() => {
    loadTimetable();
  }, [loadTimetable]);

  if (isLoading) {
    return <EmptyState title="시간표를 불러오는 중" description={`${grade}학년 ${classNumber}반 오늘 시간표를 확인하고 있어요.`} />;
  }

  if (error) {
    return <EmptyState title="시간표를 불러오지 못했어요" description={error} actionLabel="다시 시도" onAction={loadTimetable} />;
  }

  if (!todayKey) {
    return <EmptyState title="오늘은 주말이에요" description="평일 시간표만 표시됩니다." />;
  }

  if (subjects.length === 0) {
    return (
      <EmptyState
        title="오늘 시간표가 없어요"
        description={source === 'local' ? '아직 직접 입력한 시간표가 없어요.' : '공휴일, 방학이거나 NEIS에 오늘 시간표가 아직 등록되지 않았을 수 있어요.'}
        actionLabel={source === 'neis' ? '다시 시도' : undefined}
        onAction={source === 'neis' ? loadTimetable : undefined}
      />
    );
  }

  return <TimetableCard dayLabel={weekdayLabels[todayKey]} subjects={subjects} isToday />;
}
