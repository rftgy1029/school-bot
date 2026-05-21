'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { addDays, format } from 'date-fns';
import { EmptyState } from '@/components/EmptyState';
import { MealCard } from '@/components/MealCard';
import type { Meal } from '@/types/meal';

type MealsResponse = {
  meals?: Meal[];
  error?: string;
};

type MealScope = 'today' | 'tomorrow' | 'week';

type MealSectionProps = {
  officeCode: string;
  schoolCode: string;
  emptyDescription?: string;
};

const scopeLabels: Record<MealScope, string> = {
  today: '오늘',
  tomorrow: '내일',
  week: '이번 주',
};

function formatYmd(date: Date): string {
  return format(date, 'yyyyMMdd');
}

function getRange(scope: MealScope) {
  const now = new Date();

  if (scope === 'tomorrow') {
    const tomorrow = addDays(now, 1);
    return { from: formatYmd(tomorrow), to: formatYmd(tomorrow) };
  }

  if (scope === 'week') {
    const sunday = addDays(now, 6 - now.getDay());
    return { from: formatYmd(now), to: formatYmd(sunday) };
  }

  const today = formatYmd(now);
  return { from: today, to: today };
}

export function MealSection({ officeCode, schoolCode, emptyDescription = '오늘 등록된 급식 정보가 없습니다.' }: MealSectionProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [scope, setScope] = useState<MealScope>('today');

  const dateRange = useMemo(() => getRange(scope), [scope]);

  const loadMeals = useCallback(async () => {
    setIsLoading(true);

    try {
      const params = new URLSearchParams({
        officeCode,
        schoolCode,
        from: dateRange.from,
        to: dateRange.to,
      });

      const response = await fetch(`/api/meals?${params}`, { cache: 'no-store' });
      const data = (await response.json()) as MealsResponse;

      if (!response.ok) {
        throw new Error(data.error ?? '급식 정보를 불러오지 못했습니다.');
      }

      setMeals(data.meals ?? []);
      setError(null);
    } catch (nextError) {
      setError(nextError instanceof Error ? nextError.message : '급식 정보를 불러오지 못했습니다.');
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [dateRange.from, dateRange.to, officeCode, schoolCode]);

  useEffect(() => {
    loadMeals();
  }, [loadMeals]);

  return (
    <section className="space-y-4">
      <div className="inline-flex rounded-2xl bg-slate-100 p-1">
        {(Object.keys(scopeLabels) as MealScope[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setScope(key)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${scope === key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
          >
            {scopeLabels[key]}
          </button>
        ))}
      </div>

      {isLoading ? <EmptyState title="급식 정보를 불러오는 중" description="NEIS 급식 정보를 확인하고 있어요." /> : null}

      {!isLoading && error ? <EmptyState title="급식 정보를 불러오지 못했어요" description={error} actionLabel="다시 시도" onAction={loadMeals} /> : null}

      {!isLoading && !error && meals.length === 0 ? <EmptyState title={`${scopeLabels[scope]} 급식 정보가 없어요`} description={emptyDescription} actionLabel="다시 시도" onAction={loadMeals} /> : null}

      {!isLoading && !error && meals.length > 0 ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {meals.map((meal) => (
            <MealCard key={`${meal.date}-${meal.mealType}`} meal={meal} />
          ))}
        </div>
      ) : null}
    </section>
  );
}
