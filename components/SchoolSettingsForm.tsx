'use client';

import type { FormEvent } from 'react';
import { useSchoolSettings } from '@/lib/storage';

export function SchoolSettingsForm() {
  const { settings, saveSettings } = useSchoolSettings();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    saveSettings({
      schoolName: String(formData.get('schoolName') ?? ''),
      educationOfficeCode: String(formData.get('educationOfficeCode') ?? ''),
      schoolCode: String(formData.get('schoolCode') ?? ''),
      grade: String(formData.get('grade') ?? ''),
      classNumber: String(formData.get('classNumber') ?? ''),
      mealType: 'lunch',
    });
  }

  return (
    <form
      key={`${settings.schoolName}-${settings.educationOfficeCode}-${settings.schoolCode}-${settings.grade}-${settings.classNumber}`}
      onSubmit={handleSubmit}
      className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft"
    >
      <label className="block">
        <span className="text-sm font-semibold text-slate-700">학교명</span>
        <input name="schoolName" defaultValue={settings.schoolName} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">교육청 코드</span>
          <input name="educationOfficeCode" defaultValue={settings.educationOfficeCode} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">학교 코드</span>
          <input name="schoolCode" defaultValue={settings.schoolCode} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">학년</span>
          <input name="grade" defaultValue={settings.grade} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">반</span>
          <input name="classNumber" defaultValue={settings.classNumber} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
      </div>
      <button className="w-full rounded-2xl bg-brand-600 px-5 py-3 font-bold text-white transition hover:bg-brand-700" type="submit">
        설정 저장하기
      </button>
    </form>
  );
}
