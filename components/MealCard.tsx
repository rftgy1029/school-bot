import type { Meal } from '@/types/meal';

const mealTypeLabels = {
  breakfast: '조식',
  lunch: '중식',
  dinner: '석식',
};

type MealCardProps = {
  meal: Meal;
};

export function MealCard({ meal }: MealCardProps) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-brand-600">{meal.date}</p>
          <h3 className="text-xl font-bold text-slate-950">{mealTypeLabels[meal.mealType]}</h3>
        </div>
        {meal.calorie ? (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700">{meal.calorie}</span>
        ) : null}
      </div>

      <ul className="space-y-2 text-slate-700">
        {meal.menuItems.map((item) => (
          <li key={item} className="rounded-2xl bg-slate-50 px-4 py-2">
            {item}
          </li>
        ))}
      </ul>

      {meal.allergyNumbers?.length ? (
        <p className="mt-4 text-sm text-slate-500">알레르기 번호: {meal.allergyNumbers.join(', ')}</p>
      ) : null}
    </article>
  );
}
