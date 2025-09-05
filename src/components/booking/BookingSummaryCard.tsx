export default function BookingSummaryCard({
  title,
  whenText,
}: {
  title: string;
  whenText: string;
}) {
  return (
    <div className="mb-6 rounded-2xl border border-gray-200 p-4">
      <div className="mb-2 text-[15px] font-semibold text-gray-800">{title}</div>
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="inline-block rounded-full border border-gray-200 px-2 py-0.5 text-[11px] text-slate-500">
          일정
        </span>
        <span className="text-[13px]">{whenText}</span>
      </div>
    </div>
  );
}
