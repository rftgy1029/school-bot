import { SchoolSettingsForm } from '@/components/SchoolSettingsForm';

export default function SettingsPage() {
  return (
    <main className="space-y-6">
      <section>
        <p className="text-sm font-semibold text-brand-600">Settings</p>
        <h1 className="mt-2 text-3xl font-black text-slate-950">학교 설정</h1>
        <p className="mt-3 text-slate-600">학교, 학년, 반 정보를 브라우저에 저장합니다.</p>
      </section>
      <SchoolSettingsForm />
    </main>
  );
}
