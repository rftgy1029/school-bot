'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { ZodError } from 'zod';
import { useSchoolSettings } from '@/lib/storage';
import type { SchoolSettings } from '@/types/settings';

export function SchoolSettingsForm() {
  const { settings, saveSettings, settingsSchema } = useSchoolSettings();
  const [showCompleteMessage, setShowCompleteMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formKey = useMemo(
    () => `${settings.schoolName}-${settings.educationOfficeCode}-${settings.schoolCode}-${settings.grade}-${settings.classNumber}-${settings.padletUrl}`,
    [settings],
  );

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
      educationOfficeCode: String(formData.get('educationOfficeCode') ?? '').toUpperCase(),
      schoolCode: String(formData.get('schoolCode') ?? ''),
      grade: String(formData.get('grade') ?? ''),
      classNumber: String(formData.get('classNumber') ?? ''),
      mealType: 'lunch',
      padletUrl: settings.padletUrl,
    };

    try {
      const validated = settingsSchema.parse(nextSettings);
      const changedClassInfo = validated.grade !== settings.grade || validated.classNumber !== settings.classNumber;

      saveSettings(validated);
      setErrorMessage(null);

      if (changedClassInfo) {
        setShowCompleteMessage(true);
      }
    } catch (error) {
      if (error instanceof ZodError) {
        setErrorMessage(error.issues[0]?.message ?? '입력값을 확인해 주세요.');
        return;
      }

      setErrorMessage('설정을 저장하지 못했어요. 다시 시도해 주세요.');
    }
  }

  return (
    <>
      <form key={formKey} onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-soft">
        <label className="block">
          <span className="text-sm font-semibold text-slate-700">학교명</span>
          <input name="schoolName" defaultValue={settings.schoolName} className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">교육청 코드</span>
            <input
              name="educationOfficeCode"
              defaultValue={settings.educationOfficeCode}
              maxLength={3}
              placeholder="예: B10"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 uppercase"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">학교 코드</span>
            <input
              name="schoolCode"
              defaultValue={settings.schoolCode}
              inputMode="numeric"
              maxLength={7}
              placeholder="7자리 숫자"
              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">학년</span>
            <input
              name="grade"
              defaultValue={settings.grade}
              inputMode="numeric"
              readOnly
              aria-readonly="true"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
            />
          </label>
          <label className="block">
            <span className="text-sm font-semibold text-slate-700">반</span>
            <input
              name="classNumber"
              defaultValue={settings.classNumber}
              inputMode="numeric"
              readOnly
              aria-readonly="true"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-semibold text-slate-700">학급 공지 Padlet 링크</span>
          <input
            value={settings.padletUrl}
            readOnly
            className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-600"
            aria-readonly="true"
          />
        </label>

        {errorMessage ? <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{errorMessage}</p> : null}

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
