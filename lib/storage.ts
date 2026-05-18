'use client';

import { useEffect, useState } from 'react';
import type { SchoolSettings } from '@/types/settings';
import type { Timetable } from '@/types/timetable';
import { defaultTimetable } from './timetable';

const settingsKey = 'school-bot:settings';
const timetableKey = 'school-bot:timetable';

const defaultSettings: SchoolSettings = {
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

export function useSchoolSettings() {
  const [settings, setSettings] = useState<SchoolSettings>(defaultSettings);

  useEffect(() => {
    setSettings(readJson(settingsKey, defaultSettings));
  }, []);

  function saveSettings(nextSettings: SchoolSettings) {
    setSettings(nextSettings);
    writeJson(settingsKey, nextSettings);
  }

  return { settings, saveSettings };
}

export function useTimetable() {
  const [timetable, setTimetable] = useState<Timetable>(defaultTimetable);

  useEffect(() => {
    setTimetable(readJson(timetableKey, defaultTimetable));
  }, []);

  function saveTimetable(nextTimetable: Timetable) {
    setTimetable(nextTimetable);
    writeJson(timetableKey, nextTimetable);
  }

  return { timetable, saveTimetable };
}
