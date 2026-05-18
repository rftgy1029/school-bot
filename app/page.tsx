'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/EmptyState';
import { MealCard } from '@/components/MealCard';
import { TimetableCard } from '@/components/TimetableCard';
import { formatKoreanDate, getTodayWeekdayKey, weekdayLabels } from '@/lib/dates';
import { sampleMeals } from '@/lib/sample-data';
import { useSchoolSettings, useTimetable } from '@/lib/storage';

export default function HomePage() {
  const { settings } = useSchoolSettings();
  const { timetable } = useTimetable();
  const todayKey = getTodayWeekdayKey();
  const todaySubjects = todayKey ? timetable[todayKey] : [];

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-soft">
        <p className="text-sm font-semibold opacity-90">{formatKoreanDate(new Date())}</p>
        <h1 className="mt-2 text-3xl font-black">오늘의 학교생활</h1>
        <p className="mt-3 text-brand-50">
          {settings.schoolName} {settings.grade}학년 {settings.classNumber}반의 급식과 시간표를 확인하세요.
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <MealCard meal={sampleMeals[0]} />
        {todayKey ? (
          <TimetableCard dayLabel={weekdayLabels[todayKey]} subjects={todaySubjects} isToday />
        ) : (
          <EmptyState title="오늘은 주말이에요" description="평일 시간표는 시간표 메뉴에서 확인할 수 있어요." />
        )}
      </div>

      <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <h2 className="text-xl font-bold text-slate-950">먼저 설정을 확인해 주세요</h2>
        <p className="mt-2 text-slate-600">학교 코드와 학년·반을 저장하면 이후 NEIS API 연동 시 내 학교 급식을 불러올 수 있습니다.</p>
        <Link href="/settings" className="mt-4 inline-flex rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white">
          설정하러 가기
        </Link>
      </section>
    </main>
  );
}
