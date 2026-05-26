'use client';

import { useEffect, useState } from 'react';
import { z } from 'zod';
import { normalizePadletUrl } from '@/lib/padlet';
import type { SchoolSettings } from '@/types/settings';
import type { Timetable, WeekdayKey } from '@/types/timetable';

const settingsKey = 'school-bot:settings';
const timetableKey = 'school-bot:timetable';
const defaultPadletUrl = 'https://padlet.com/25sdj115/2-1-vlm4vpq98okxy91x';

const schoolSettingsSchema = z.object({
  schoolName: z.string().trim().min(1, '학교명을 입력해 주세요.').max(40, '학교명은 40자 이내로 입력해 주세요.'),
  educationOfficeCode: z.string().trim().regex(/^[A-Z]\d{2}$/, '교육청 코드는 예: B10 형식으로 입력해 주세요.'),
  schoolCode: z.string().trim().regex(/^\d{7}$/, '학교 코드는 7자리 숫자로 입력해 주세요.'),
  grade: z.string().trim().regex(/^[1-6]$/, '학년은 1~6 사이 숫자로 입력해 주세요.'),
  classNumber: z.string().trim().regex(/^\d{1,2}$/, '반은 1~99 사이 숫자로 입력해 주세요.'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner']),
  padletUrl: z.string().trim().default(defaultPadletUrl),
});

const weekdayKeys: WeekdayKey[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];

const timetableSchema = z.object({
  monday: z.array(z.string()),
  tuesday: z.array(z.string()),
  wednesday: z.array(z.string()),
  thursday: z.array(z.string()),
  friday: z.array(z.string()),
});

export const defaultSettings: SchoolSettings = {
  schoolName: '서대전고등학교',
  educationOfficeCode: 'G10',
  schoolCode: '7430059',
  grade: '2',
  classNumber: '1',
  mealType: 'lunch',
  padletUrl: defaultPadletUrl,
};

export const defaultTimetable: Timetable = {
  monday: Array(7).fill(''),
  tuesday: Array(7).fill(''),
  wednesday: Array(7).fill(''),
  thursday: Array(7).fill(''),
  friday: Array(7).fill(''),
};

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') {
    return fallback;
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return fallback;
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  window.localStorage.setItem(key, JSON.stringify(value));
}

function normalizeSettings(settings: SchoolSettings): SchoolSettings {
  const parsed = schoolSettingsSchema.safeParse(settings);
  if (!parsed.success) {
    return defaultSettings;
  }

  const normalizedPadletUrl = normalizePadletUrl(parsed.data.padletUrl) || defaultSettings.padletUrl;

  return {
    schoolName: parsed.data.schoolName,
    educationOfficeCode: parsed.data.educationOfficeCode,
    schoolCode: parsed.data.schoolCode,
    grade: parsed.data.grade,
    classNumber: parsed.data.classNumber,
    mealType: parsed.data.mealType,
    padletUrl: normalizedPadletUrl,
  };
}

function normalizeTimetable(timetable: Timetable): Timetable {
  const parsed = timetableSchema.safeParse(timetable);
  if (!parsed.success) {
    return defaultTimetable;
  }

  const normalized = { ...defaultTimetable };

  for (const key of weekdayKeys) {
    const daySubjects = parsed.data[key].map((subject) => subject.trim());
    normalized[key] = [...daySubjects, ...Array(Math.max(0, 7 - daySubjects.length)).fill('')].slice(0, 7);
  }

  return normalized;
}

export function useSchoolSettings() {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);

  useEffect(() => {
    setSettings(normalizeSettings(readJson(settingsKey, defaultSettings)));
  }, []);

  function saveSettings(nextSettings: SchoolSettings) {
    const normalizedSettings = normalizeSettings(nextSettings);
    setSettings(normalizedSettings);
    writeJson(settingsKey, normalizedSettings);
  }

  return { settings, saveSettings, settingsSchema: schoolSettingsSchema };
}

export function useTimetable() {
  const [timetable, setTimetable] = useState<Timetable>(defaultTimetable);

  useEffect(() => {
    setTimetable(normalizeTimetable(readJson(timetableKey, defaultTimetable)));
  }, []);

  function saveTimetable(nextTimetable: Timetable) {
    const normalizedTimetable = normalizeTimetable(nextTimetable);
    setTimetable(normalizedTimetable);
    writeJson(timetableKey, normalizedTimetable);
  }

  return { timetable, saveTimetable };
}
