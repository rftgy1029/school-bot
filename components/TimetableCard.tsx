type TimetableCardProps = {
  dayLabel: string;
  subjects: string[];
  isToday?: boolean;
};

export function TimetableCard({ dayLabel, subjects, isToday = false }: TimetableCardProps) {
  return (
    <article className={`rounded-3xl border p-5 shadow-soft ${isToday ? 'border-brand-200 bg-brand-50' : 'border-slate-200 bg-white'}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-xl font-bold text-slate-950">{dayLabel}</h3>
        {isToday ? <span className="rounded-full bg-brand-600 px-3 py-1 text-sm font-semibold text-white">오늘</span> : null}
      </div>
      <ol className="space-y-2">
        {subjects.map((subject, index) => (
          <li key={`${subject}-${index}`} className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-2 text-slate-700">
            <span className="font-semibold text-brand-700">{index + 1}교시</span>
            <span>{subject || '미입력'}</span>
          </li>
        ))}
      </ol>
    </article>
  );
}
