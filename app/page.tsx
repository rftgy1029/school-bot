'use client';

import { MealSection } from '@/components/MealSection';
import { TimetableSection } from '@/components/TimetableSection';
import { formatKoreanDate } from '@/lib/dates';
import { useSchoolSettings, useTimetable } from '@/lib/storage';

export default function HomePage() {
  const { settings } = useSchoolSettings();
  const { timetable } = useTimetable();

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-soft">
        <p className="text-sm font-semibold opacity-90">{formatKoreanDate(new Date())}</p>
        <h1 className="mt-2 text-3xl font-black">{settings.schoolName}</h1>
        <p className="mt-3 text-brand-50">
          {settings.grade}학년 {settings.classNumber}반 기준으로 학교생활 정보를 보여줍니다.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <MealSection
          officeCode={settings.educationOfficeCode}
          schoolCode={settings.schoolCode}
          emptyDescription="주말, 공휴일, 방학이거나 NEIS에 오늘 급식이 아직 등록되지 않았을 수 있어요."
        />
        <TimetableSection
          grade={settings.grade}
          classNumber={settings.classNumber}
          officeCode={settings.educationOfficeCode}
          schoolCode={settings.schoolCode}
          source="neis"
          localTimetable={timetable}
        />
      </div>
    </main>
  );
}
