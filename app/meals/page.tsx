import { MealCard } from '@/components/MealCard';
import { sampleMeals } from '@/lib/sample-data';

export default function MealsPage() {
  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-600">Meals</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">급식 보기</h1>
        <p className="mt-3 text-slate-600">NEIS API 연동 전까지는 샘플 급식 카드로 화면 구조를 먼저 확인합니다.</p>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        {sampleMeals.map((meal) => (
          <MealCard key={meal.date} meal={meal} />
        ))}
      </div>
    </main>
  );
}
