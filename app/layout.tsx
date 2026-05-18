import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'School Bot',
  description: '학교 급식과 시간표를 알려주는 웹앱',
};

const navItems = [
  { href: '/', label: '홈' },
  { href: '/meals', label: '급식' },
  { href: '/timetable', label: '시간표' },
  { href: '/settings', label: '설정' },
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <div className="mx-auto min-h-screen max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <header className="mb-8 flex flex-col gap-4 rounded-3xl bg-white p-4 shadow-soft sm:flex-row sm:items-center sm:justify-between">
            <Link href="/" className="text-2xl font-black text-slate-950">
              School Bot
            </Link>
            <nav className="flex flex-wrap gap-2">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-brand-50 hover:text-brand-700">
                  {item.label}
                </Link>
              ))}
            </nav>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
