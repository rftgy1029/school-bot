'use client';

import type { ChangeEvent } from 'react';
import { getTodayWeekdayKey, weekdayLabels } from '@/lib/dates';
import { useTimetable } from '@/lib/storage';
import type { Timetable, WeekdayKey } from '@/types/timetable';

const weekdays = Object.keys(weekdayLabels) as WeekdayKey[];
const periodCount = 7;

export function TimetableEditor() {
  const { timetable, saveTimetable } = useTimetable();
  const todayKey = getTodayWeekdayKey();

  function updateSubject(day: WeekdayKey, periodIndex: number, subject: string) {
    const nextTimetable: Timetable = {
      ...timetable,
      [day]: Array.from({ length: periodCount }, (_, index) => timetable[day][index] ?? ''),
    };

    nextTimetable[day][periodIndex] = subject;
    saveTimetable(nextTimetable);
  }

  return (
    <div className="space-y-5">
      {weekdays.map((day) => (
        <section key={day} className={`rounded-3xl border p-5 shadow-soft ${day === todayKey ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-950">{weekdayLabels[day]}</h2>
            {day === todayKey ? <span className="rounded-full bg-brand-600 px-3 py-1 text-sm font-semibold text-white">오늘</span> : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Array.from({ length: periodCount }, (_, index) => (
              <label key={`${day}-${index}`} className="block">
                <span className="text-sm font-semibold text-slate-600">{index + 1}교시</span>
                <input
                  value={timetable[day][index] ?? ''}
                  onChange={(event: ChangeEvent<HTMLInputElement>) => updateSubject(day, index, event.target.value)}
                  placeholder="과목 입력"
                  className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
                />
              </label>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
