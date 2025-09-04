import { useEffect, useMemo, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import Holidays from "date-holidays";

type SlotsByDate = Record<string, string[]>;

const toYMD = (d: Date | null) =>
  d
    ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate(),
      ).padStart(2, "0")}`
    : "";
const toYM = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

interface Booking {
  mentorId: number;
  date: string;
  time: string;
}

interface BookingPageProps {
  mentorId?: number;
  defaultMonth?: Date;
  onReserve?: (payload: Booking) => void;
}

export default function BookingPage({
  mentorId = 1,
  defaultMonth = new Date(),
  onReserve,
}: BookingPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [currentMonth, setCurrentMonth] = useState<Date>(defaultMonth);

  const monthKey = useMemo(() => toYM(currentMonth), [currentMonth]);

  // ✅ 공휴일: date-holidays(KR)
  const hd = useMemo(() => new Holidays("KR"), []);
  const koreanHolidays = useMemo(() => {
    const list = hd.getHolidays(currentMonth.getFullYear());
    const map = new Map<string, string>();
    list.forEach((h) => {
      const key = h.date.slice(0, 10); // "YYYY-MM-DD"
      map.set(key, h.name);
    });
    return map;
  }, [currentMonth, hd]);

  const isHoliday = (date: Date) => koreanHolidays.has(toYMD(date));
  const getHolidayName = (date: Date) => koreanHolidays.get(toYMD(date));

  // ✅ 매일 동일 시간표
  const commonSlots = [
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
  ];

  const selectedDateStr = toYMD(selectedDate);
  const now = new Date();
  const LEAD_MINUTES = 120;

  // "YYYY-MM-DD"의 selectedDate와 "HH:mm"을 합쳐 로컬 Date 만들기
  const slotToDate = (base: Date, hm: string) => {
    const [h, m] = hm.split(":").map(Number);
    return new Date(base.getFullYear(), base.getMonth(), base.getDate(), h, m ?? 0, 0, 0);
  };
  // 선택한 날짜의 시간대 (오늘이면 현재시각 이후만 노출)
  const availableTimes = useMemo(() => {
    if (!selectedDate) return [];
    // 최소 예약 가능 시각 = 지금 + 120분
    const minAllowed = new Date();
    minAllowed.setMinutes(minAllowed.getMinutes() + LEAD_MINUTES);

    // 오늘이면 2시간 룰로 필터, 미래 날짜면 전부 허용
    const isSelToday = selectedDate.toDateString() === now.toDateString();
    if (!isSelToday) return commonSlots;
    return commonSlots.filter((t) => slotToDate(selectedDate, t) > minAllowed);
  }, [selectedDate]);

  // 달력 6×7 생성
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    const days: Date[] = [];
    const cur = new Date(startDate);
    while (days.length < 42) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  };

  const calendarDays = generateCalendar(currentMonth);
  const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

  const goToPrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const isToday = (date: Date) =>
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth.getMonth();
  const isSelected = (date: Date) =>
    !!selectedDate && date.toDateString() === selectedDate.toDateString();

  // 과거 날짜 선택 불가
  const isPastDate = (date: Date) =>
    date < new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const handleDateClick = (date: Date) => {
    if (!isCurrentMonth(date) || isPastDate(date)) return;
    setSelectedDate(date);
    setSelectedTime("");
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const handleReservation = () => {
    if (!selectedDate || !selectedTime) return;
    const booking: Booking = { mentorId, date: toYMD(selectedDate), time: selectedTime };
    onReserve?.(booking);
    alert(`(Mock) 예약 완료: ${booking.date} ${booking.time}`);
  };

  // 진입 시 오늘을 기본 선택
  useEffect(() => {
    if (selectedDate) return;
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    setSelectedDate(today);
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  }, [monthKey]); // 월 변경 시에도 유지

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl bg-white">
        {/* 헤더 */}
        <div className="border-b border-gray-100 px-6 py-4 text-center">
          <h1 className="font-WooridaumB text-base font-medium text-gray-600">
            인생 역전, 공격투자 멘토링
          </h1>
        </div>

        {/* 달력 섹션 */}
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <button onClick={goToPrevMonth} className="flex h-6 w-6 items-center justify-center">
              <ChevronLeft size={20} className="text-gray-400" />
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {currentMonth.getFullYear()}.{currentMonth.getMonth() + 1}
            </h2>
            <button onClick={goToNextMonth} className="flex h-6 w-6 items-center justify-center">
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          </div>

          {/* 요일 */}
          <div className="mb-3 grid grid-cols-7 gap-1">
            {dayNames.map((day, i) => (
              <div key={day} className="flex h-8 items-center justify-center">
                <span
                  className={`text-xs font-medium ${
                    i === 0 ? "text-red-500" : i === 6 ? "text-blue-500" : "text-gray-500"
                  }`}>
                  {day}
                </span>
              </div>
            ))}
          </div>

          {/* 날짜 */}
          <div className="mb-8 grid grid-cols-7 gap-1">
            {calendarDays.map((date, idx) => {
              const inMonth = isCurrentMonth(date);
              const today = isToday(date);
              const chosen = isSelected(date);
              const holiday = isHoliday(date);
              const holidayName = getHolidayName(date);
              const disabled = !inMonth || isPastDate(date);
              const dow = date.getDay();

              const color = inMonth
                ? dow === 0 || holiday
                  ? "text-red-500"
                  : dow === 6
                    ? "text-blue-500"
                    : "text-gray-700"
                : "text-gray-300";

              return (
                <button
                  key={idx}
                  onClick={() => handleDateClick(date)}
                  disabled={disabled}
                  className="relative flex h-10 w-10 items-center justify-center text-sm font-medium disabled:cursor-not-allowed">
                  {/* 선택 배경 */}
                  {chosen ? (
                    <div className="absolute inset-0 grid place-items-center rounded-lg bg-[#005EF9] text-white">
                      {date.getDate()}
                    </div>
                  ) : (
                    <span className={color}>{date.getDate()}</span>
                  )}

                  {/* 라벨 */}
                  {!chosen && (
                    <>
                      {today && (
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 transform text-[9px] font-medium whitespace-nowrap text-[#005EF9]">
                          오늘
                        </div>
                      )}
                      {holiday && !today && (
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

          {/* 시간 선택 */}
          <div className="mb-8 grid grid-cols-3 gap-3">
            {(selectedDateStr ? availableTimes : []).map((timeStr) => {
              const chosen = selectedTime === timeStr;

              let ok = true;
              if (selectedDate) {
                const minAllowed = new Date();
                minAllowed.setMinutes(minAllowed.getMinutes() + LEAD_MINUTES);
                ok = slotToDate(selectedDate, timeStr) > minAllowed;
              }

              return (
                <button
                  key={timeStr}
                  onClick={() => ok && setSelectedTime(timeStr)}
                  disabled={!ok}
                  className={`h-12 rounded-lg border text-sm font-medium transition-colors ${
                    ok
                      ? chosen
                        ? "border-blue-500 bg-[#005EF9] text-white"
                        : "border-gray-200 bg-white text-[#4D4B4C] hover:border-gray-300"
                      : "cursor-not-allowed border-[#E9E9EC] bg-gray-50 text-gray-400"
                  }`}>
                  {timeStr}
                </button>
              );
            })}
          </div>

          {/* 예약하기 (로그인 버튼과 동일 스타일/크기) */}
          <button
            type="button"
            onClick={handleReservation}
            disabled={!selectedDate || !selectedTime}
            className={`font-WooridaumB h-14 w-full rounded-2xl text-base font-extrabold text-white shadow transition active:scale-[0.99] ${
              selectedDate && selectedTime
                ? "bg-[#1161FF] hover:bg-[#0C2D62]"
                : "cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300"
            }`}>
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}
