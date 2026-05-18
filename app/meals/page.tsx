import { EmptyState } from '@/components/EmptyState';

export default function MealsPage() {
  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-600">Meals</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">급식 보기</h1>
        <p className="mt-3 text-slate-600">서대전고등학교 급식 정보를 표시할 준비를 마쳤습니다.</p>
      </section>
      <EmptyState title="급식 정보 준비 중" description="테스트 급식값은 제거했습니다. NEIS 연동 후 실제 급식이 표시됩니다." />
    </main>
  );
}
