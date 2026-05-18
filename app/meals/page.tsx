import { MealSection } from '@/components/MealSection';

export default function MealsPage() {
  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-600">Meals</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">급식 보기</h1>
        <p className="mt-3 text-slate-600">서대전고등학교 오늘 급식 정보를 NEIS에서 불러옵니다.</p>
      </section>
      <MealSection emptyDescription="주말, 공휴일, 방학이거나 NEIS에 오늘 급식이 아직 등록되지 않았을 수 있어요." />
    </main>
  );
}
