'use client';

import { MealSection } from '@/components/MealSection';
import { useSchoolSettings } from '@/lib/storage';

export default function MealsPage() {
  const { settings } = useSchoolSettings();

  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-600">Meals</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">급식 보기</h1>
        <p className="mt-3 text-slate-600">{settings.schoolName} 급식 정보를 오늘, 내일, 이번 주 단위로 조회합니다.</p>
      </section>
      <MealSection
        officeCode={settings.educationOfficeCode}
        schoolCode={settings.schoolCode}
        emptyDescription="주말, 공휴일, 방학이거나 NEIS에 급식이 아직 등록되지 않았을 수 있어요."
      />
    </main>
  );
}
