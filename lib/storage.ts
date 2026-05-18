'use client';

import { useEffect, useState } from 'react';
import type { SchoolSettings } from '@/types/settings';

const settingsKey = 'school-bot:settings';

export const fixedSchoolCodes = {
  educationOfficeCode: 'G10',
  schoolCode: '7430059',
} as const;

export const defaultSettings: SchoolSettings = {
  schoolName: '서대전고등학교',
  educationOfficeCode: fixedSchoolCodes.educationOfficeCode,
  schoolCode: fixedSchoolCodes.schoolCode,
  grade: '2',
  classNumber: '1',
  mealType: 'lunch',
};

const legacyDefaultSettings: SchoolSettings = {
  schoolName: '우리학교',
  educationOfficeCode: 'B10',
  schoolCode: '7010111',
  grade: '2',
  classNumber: '3',
  mealType: 'lunch',
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
  const isLegacyDefault =
    settings.schoolName === legacyDefaultSettings.schoolName &&
    settings.educationOfficeCode === legacyDefaultSettings.educationOfficeCode &&
    settings.schoolCode === legacyDefaultSettings.schoolCode &&
    settings.grade === legacyDefaultSettings.grade &&
    settings.classNumber === legacyDefaultSettings.classNumber;

  if (isLegacyDefault) {
    return defaultSettings;
  }

  return {
    ...defaultSettings,
    ...settings,
    educationOfficeCode: fixedSchoolCodes.educationOfficeCode,
    schoolCode: fixedSchoolCodes.schoolCode,
  };
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

  return { settings, saveSettings };
}
