--'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { fixedSchoolCodes, useSchoolSettings } from '@/lib/storage';
import type { SchoolSettings } from '@/types/settings';

export function SchoolSettingsForm() {
  const { settings, saveSettings } = useSchoolSettings();
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);

  useEffect(() => {
    if (!showCompleteMessage) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setShowCompleteMessage(false);
    }, 2200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [showCompleteMessage]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const nextSettings: SchoolSettings = {
      schoolName: String(formData.get('schoolName') ?? ''),
      educationOfficeCode: fixedSchoolCodes.educationOfficeCode,
      schoolCode: fixedSchoolCodes.schoolCode,
      grade: String(formData.get('grade') ?? ''),
      classNumber: String(formData.get('classNumber') ?? ''),
      mealType: 'lunch',
    };

    const changedClassInfo = nextSettings.grade !== settings.grade || nextSettings.classNumber !== settings.classNumber;

    saveSettings(nextSettings);

    if (changedClassInfo) {
      setShowCompleteMessage(true);
    }
  }

  return (
    <>
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
            <input
              name="educationOfficeCode"
              value={fixedSchoolCodes.educationOfficeCode}
              readOnly
              aria-readonly="true"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
            />
            <span className="mt-1 block text-xs font-medium text-slate-500">서대전고등학교 기본값으로 고정</span>
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">학교 코드</span>
            <input
              name="schoolCode"
              value={fixedSchoolCodes.schoolCode}
              readOnly
              aria-readonly="true"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-slate-600"
            />
            <span className="mt-1 block text-xs font-medium text-slate-500">서대전고등학교 기본값으로 고정</span>
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

      {showCompleteMessage ? (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-2xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-soft">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500 text-white">✓</span>
          설정완료
        </div>
      ) : null}
    </>
  );
}
