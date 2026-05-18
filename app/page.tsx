'use client';

import Link from 'next/link';
import { EmptyState } from '@/components/EmptyState';
import { TimetableCard } from '@/components/TimetableCard';
import { formatKoreanDate, getTodayWeekdayKey, weekdayLabels } from '@/lib/dates';
import { fixedSchoolCodes, useSchoolSettings, useTimetable } from '@/lib/storage';

export default function HomePage() {
  const { settings } = useSchoolSettings();
  const { timetable } = useTimetable();
  const todayKey = getTodayWeekdayKey();
  const todaySubjects = todayKey ? timetable[todayKey] : [];

  return (
    <main className="space-y-6">
      <section className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-700 p-6 text-white shadow-soft">
        <p className="text-sm font-semibold opacity-90">{formatKoreanDate(new Date())}</p>
        <h1 className="mt-2 text-3xl font-black">{settings.schoolName}</h1>
        <p className="mt-3 text-brand-50">
          {settings.grade}학년 {settings.classNumber}반 기준으로 학교생활 정보를 보여줍니다.
        </p>
      </section>

      <section className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold text-slate-500">교육청 코드</p>
          <p className="mt-1 text-2xl font-black text-slate-950">{fixedSchoolCodes.educationOfficeCode}</p>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-500">학교 코드</p>
          <p className="mt-1 text-2xl font-black text-slate-950">{fixedSchoolCodes.schoolCode}</p>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <EmptyState title="급식 정보 준비 중" description="NEIS 연동 후 서대전고등학교 급식이 표시됩니다." />
        {todayKey && todaySubjects.length > 0 ? (
          <TimetableCard dayLabel={weekdayLabels[todayKey]} subjects={todaySubjects} isToday />
        ) : todayKey ? (
          <EmptyState title="오늘 시간표가 비어 있어요" description="시간표 메뉴에서 실제 과목을 입력하면 메인 화면에 표시됩니다." />
        ) : (
          <EmptyState title="오늘은 주말이에요" description="평일 시간표는 시간표 메뉴에서 확인할 수 있어요." />
        )}
      </div>

      <Link href="/settings" className="inline-flex rounded-2xl bg-slate-950 px-5 py-3 font-bold text-white">
        설정 확인하기
      </Link>
    </main>
  );
}
