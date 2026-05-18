'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { TimetableCard } from '@/components/TimetableCard';
import { getTodayWeekdayKey, weekdayLabels } from '@/lib/dates';

type TimetableResponse = {
  subjects?: string[];
  error?: string;
};

type TimetableSectionProps = {
  grade: string;
  classNumber: string;
};

export function TimetableSection({ grade, classNumber }: TimetableSectionProps) {
  const [subjects, setSubjects] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const todayKey = getTodayWeekdayKey();

  useEffect(() => {
    let isMounted = true;

    async function loadTimetable() {
      try {
        const params = new URLSearchParams({ grade, classNumber });
        const response = await fetch(`/api/timetable?${params}`, { cache: 'no-store' });
        const data = (await response.json()) as TimetableResponse;

        if (!response.ok) {
          throw new Error(data.error ?? '시간표 정보를 불러오지 못했습니다.');
        }

        if (isMounted) {
          setSubjects(data.subjects ?? []);
          setError(null);
        }
      } catch (nextError) {
        if (isMounted) {
          setError(nextError instanceof Error ? nextError.message : '시간표 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadTimetable();

    return () => {
      isMounted = false;
    };
  }, [classNumber, grade]);

  if (isLoading) {
    return <EmptyState title="시간표를 불러오는 중" description={`${grade}학년 ${classNumber}반 오늘 시간표를 확인하고 있어요.`} />;
  }

  if (error) {
    return <EmptyState title="시간표를 불러오지 못했어요" description={error} />;
  }

  if (!todayKey) {
    return <EmptyState title="오늘은 주말이에요" description="평일에는 NEIS 시간표가 자동으로 표시됩니다." />;
  }

  if (subjects.length === 0) {
    return <EmptyState title="오늘 시간표가 없어요" description="공휴일, 방학이거나 NEIS에 오늘 시간표가 아직 등록되지 않았을 수 있어요." />;
  }

  return <TimetableCard dayLabel={weekdayLabels[todayKey]} subjects={subjects} isToday />;
}
