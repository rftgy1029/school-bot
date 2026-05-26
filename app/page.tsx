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

      {settings.padletUrl ? (
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 shadow-soft sm:p-5">
          <h2 className="text-xl font-black text-slate-950">학급 공지사항</h2>
          <p className="mt-2 text-sm text-slate-600">담임 공지, 수행평가, 준비물을 Padlet에서 바로 확인할 수 있어요.</p>
          <div className="mt-4 overflow-hidden rounded-2xl border border-slate-100">
            <iframe
              src={settings.padletUrl}
              title="학급 공지 Padlet"
              className="h-[560px] w-full md:h-[680px]"
              allow="camera;microphone;geolocation"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />
          </div>
        </section>
      ) : null}
    </main>
  );
}
