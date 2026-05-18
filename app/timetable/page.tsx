import { TimetableEditor } from '@/components/TimetableEditor';

export default function TimetablePage() {
  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-600">Timetable</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">시간표 편집</h1>
        <p className="mt-3 text-slate-600">요일별 과목을 입력하면 브라우저에 자동 저장됩니다.</p>
      </section>
      <TimetableEditor />
    </main>
  );
}
