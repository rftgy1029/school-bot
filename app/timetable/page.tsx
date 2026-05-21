'use client';

import { useState, type FormEvent } from 'react';
import { TimetableSection } from '@/components/TimetableSection';
import { useSchoolSettings, useTimetable } from '@/lib/storage';
import { weekdayLabels } from '@/lib/dates';
import type { WeekdayKey } from '@/types/timetable';

const weekdayKeys: WeekdayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

export default function TimetablePage() {
  const { settings } = useSchoolSettings();
  const { timetable, saveTimetable } = useTimetable();
  const [mode, setMode] = useState<'neis' | 'local'>('neis');
  const [isSaved, setIsSaved] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const nextTimetable = weekdayKeys.reduce(
      (acc, key) => {
        acc[key] = Array.from({ length: 7 }, (_, period) => String(formData.get(`${key}-${period + 1}`) ?? '').trim());
        return acc;
      },
      { ...timetable },
    );

    saveTimetable(nextTimetable);
    setIsSaved(true);
    window.setTimeout(() => setIsSaved(false), 1800);
  }

  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-600">Timetable</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">시간표 보기</h1>
        <p className="mt-3 text-slate-600">{settings.schoolName} {settings.grade}학년 {settings.classNumber}반 시간표를 조회하거나 직접 저장할 수 있어요.</p>
      </section>

      <div className="inline-flex rounded-2xl bg-slate-100 p-1">
        <button
          type="button"
          onClick={() => setMode('neis')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode === 'neis' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
        >
          NEIS 조회
        </button>
        <button
          type="button"
          onClick={() => setMode('local')}
          className={`rounded-xl px-4 py-2 text-sm font-semibold ${mode === 'local' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'}`}
        >
          직접 입력
        </button>
      </div>

      <TimetableSection
        grade={settings.grade}
        classNumber={settings.classNumber}
        officeCode={settings.educationOfficeCode}
        schoolCode={settings.schoolCode}
        source={mode}
        localTimetable={timetable}
      />

      {mode === 'local' ? (
        <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
          {weekdayKeys.map((dayKey) => (
            <section key={dayKey} className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900">{weekdayLabels[dayKey]}</h3>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 7 }, (_, period) => (
                  <label key={`${dayKey}-${period + 1}`} className="block">
                    <span className="text-xs font-semibold text-slate-500">{period + 1}교시</span>
                    <input
                      name={`${dayKey}-${period + 1}`}
                      defaultValue={timetable[dayKey]?.[period] ?? ''}
                      className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
                      placeholder="과목 입력"
                    />
                  </label>
                ))}
              </div>
            </section>
          ))}
          <button className="w-full rounded-2xl bg-brand-600 px-5 py-3 font-bold text-white transition hover:bg-brand-700" type="submit">
            시간표 저장하기
          </button>
          {isSaved ? <p className="text-sm font-semibold text-emerald-600">시간표를 저장했어요.</p> : null}
        </form>
      ) : null}
    </main>
  );
}
