'use client';

import { useEffect, useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { MealCard } from '@/components/MealCard';
import type { Meal } from '@/types/meal';

type MealsResponse = {
  meals?: Meal[];
  error?: string;
};

type MealSectionProps = {
  emptyDescription?: string;
};

export function MealSection({ emptyDescription = '오늘 등록된 급식 정보가 없습니다.' }: MealSectionProps) {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadMeals() {
      try {
        const response = await fetch('/api/meals', { cache: 'no-store' });
        const data = (await response.json()) as MealsResponse;

        if (!response.ok) {
          throw new Error(data.error ?? '급식 정보를 불러오지 못했습니다.');
        }

        if (isMounted) {
          setMeals(data.meals ?? []);
          setError(null);
        }
      } catch (nextError) {
        if (isMounted) {
          setError(nextError instanceof Error ? nextError.message : '급식 정보를 불러오지 못했습니다.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadMeals();

    return () => {
      isMounted = false;
    };
  }, []);

  if (isLoading) {
    return <EmptyState title="급식 정보를 불러오는 중" description="서대전고등학교 오늘 급식을 확인하고 있어요." />;
  }

  if (error) {
    return <EmptyState title="급식 정보를 불러오지 못했어요" description={error} />;
  }

  if (meals.length === 0) {
    return <EmptyState title="오늘 급식 정보가 없어요" description={emptyDescription} />;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {meals.map((meal) => (
        <MealCard key={`${meal.date}-${meal.mealType}`} meal={meal} />
      ))}
    </div>
  );
}
