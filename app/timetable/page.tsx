'use client';

import { TimetableSection } from '@/components/TimetableSection';
import { useSchoolSettings } from '@/lib/storage';

export default function TimetablePage() {
  const { settings } = useSchoolSettings();

  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-600">Timetable</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">시간표 보기</h1>
        <p className="mt-3 text-slate-600">서대전고등학교 {settings.grade}학년 {settings.classNumber}반 오늘 시간표를 NEIS에서 불러옵니다.</p>
      </section>
      <TimetableSection grade={settings.grade} classNumber={settings.classNumber} />
    </main>
  );
}
