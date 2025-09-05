import { ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  currentMonth: Date;
  days: Date[];
  isToday: (d: Date) => boolean;
  isPastDate: (d: Date) => boolean;
  isHoliday: (d: Date) => boolean;
  getHolidayName: (d: Date) => string | undefined;
  selectedDate: Date | null;
  onSelectDate: (d: Date) => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function Calendar({
  currentMonth,
  days,
  isToday,
  isPastDate,
  isHoliday,
  getHolidayName,
  selectedDate,
  onSelectDate,
  onPrev,
  onNext,
}: Props) {
  const todayFull = new Date();
  const isViewingThisMonth =
    currentMonth.getFullYear() === todayFull.getFullYear() &&
    currentMonth.getMonth() === todayFull.getMonth();

  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  return (
    <>
      {/* 헤더 */}
      <div className="mb-6 flex items-center justify-between">
        {!isViewingThisMonth ? (
          <button
            onClick={onPrev}
            className="flex h-6 w-6 cursor-pointer items-center justify-center"
            aria-label="이전 달">
            <ChevronLeft size={20} className="text-gray-400" />
          </button>
        ) : (
          <div className="h-6 w-6" />
        )}

        <h2 className="text-lg font-semibold text-gray-900">
          {currentMonth.getFullYear()}.{currentMonth.getMonth() + 1}
        </h2>

        <button
          onClick={onNext}
          className="flex h-6 w-6 cursor-pointer items-center justify-center"
          aria-label="다음 달">
          <ChevronRight size={20} className="text-gray-400" />
        </button>
      </div>

      {/* 요일 */}
      <div className="mb-3 grid grid-cols-7 gap-1">
        {dayNames.map((day, i) => (
          <div key={day} className="flex h-8 items-center justify-center">
            <span
              className={`text-xs font-medium ${i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-500"}`}>
              {day}
            </span>
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div className="mb-8 grid grid-cols-7 gap-1">
        {days.map((date, idx) => {
          const chosen = !!selectedDate && date.toDateString() === selectedDate.toDateString();
          const past = isPastDate(date);
          const dow = date.getDay();
          const holiday = isHoliday(date);
          const holidayName = getHolidayName(date);
          const isTodayFlag = isToday(date);

          let color = past
            ? "text-gray-300"
            : dow === 0 || holiday
              ? "text-red-500"
              : dow === 6
                ? "text-blue-500"
                : "text-gray-700";

          return (
            <button
              key={idx}
              onClick={() => !past && onSelectDate(date)}
              disabled={past}
              className={`relative flex h-10 w-10 items-center justify-center text-sm font-medium ${past ? "cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"}`}>
              {chosen ? (
                <div className="absolute inset-0 grid place-items-center rounded-lg bg-[#005EF9] text-white">
                  {date.getDate()}
                </div>
              ) : (
                <span className={color}>{date.getDate()}</span>
              )}
              {!chosen && !past && (
                <>
                  {isTodayFlag && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 transform text-[9px] font-medium whitespace-nowrap text-[#005EF9]">
                      오늘
                    </div>
                  )}
                  {holiday && !isTodayFlag && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 transform text-[9px] font-medium whitespace-nowrap text-red-500">
                      {holidayName}
                    </div>
                  )}
                </>
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
