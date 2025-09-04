import { useEffect, useMemo, useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";

type SlotsByDate = Record<string, string[]>;

const toYMD = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "");
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

  // Mock data - 실제로는 React Query나 API 호출로 대체
  const slotsByDate: SlotsByDate = {
    "2025-09-03": [
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
    ],
  };

  const selectedDateStr = toYMD(selectedDate);
  const availableTimes = useMemo(
    () => (selectedDateStr ? (slotsByDate[selectedDateStr] ?? []) : []),
    [selectedDateStr, monthKey], // monthKey 넣어서 월 바뀔 때도 안전
  );

  // 달력 생성
  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
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

  const isToday = (date: Date) => {
    const t = new Date();
    return (
      date.getFullYear() === t.getFullYear() &&
      date.getMonth() === t.getMonth() &&
      date.getDate() === t.getDate()
    );
  };
  const isCurrentMonth = (date: Date) => date.getMonth() === currentMonth.getMonth();
  const hasSlots = (date: Date) => (slotsByDate[toYMD(date)]?.length ?? 0) > 0;
  const isSelected = (date: Date) =>
    !!selectedDate && date.toDateString() === selectedDate.toDateString();

  const handleDateClick = (date: Date) => {
    if (!isCurrentMonth(date) || !hasSlots(date)) return;
    setSelectedDate(date);
    setSelectedTime("");
    // 선택하면 헤더 월도 해당 날짜로 이동
    setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
  };

  const handleReservation = () => {
    if (!selectedDate || !selectedTime) return;
    const booking: Booking = { mentorId, date: selectedDateStr, time: selectedTime };
    onReserve?.(booking);
    alert(`예약 완료: ${selectedDateStr} ${selectedTime}`);
  };

  // ✅ 오늘을 기본 선택으로(오늘에 슬롯 있을 때)
  useEffect(() => {
    if (selectedDate) return; // 이미 선택되어 있으면 스킵
    const today = new Date();
    const todayStr = toYMD(today);
    if (slotsByDate[todayStr]?.length) {
      setSelectedDate(today);
      setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    }
  }, [monthKey]); // 월이 초기 렌더링 될 때 1회 동작

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl bg-white">
        {/* 헤더 */}
        <div className="border-b border-gray-100 px-6 py-4 text-center">
          <h1 className="text-base font-medium text-gray-600">인생 역전, 공격투자 멘토링</h1>
        </div>

        {/* 달력 섹션 */}
        <div className="p-6">
          {/* 월/년도 + 네비 */}
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
              const available = hasSlots(date);
              const chosen = isSelected(date);
              const dow = date.getDay();

              return (
                <button
                  key={idx}
                  onClick={() => handleDateClick(date)}
                  disabled={!inMonth || !available}
                  className="relative flex h-10 w-10 items-center justify-center text-sm font-medium">
                  {/* 숫자 */}
                  <span
                    className={[
                      !inMonth && "text-gray-300",
                      inMonth && !available && dow === 0 && "text-red-400",
                      inMonth && !available && dow === 6 && "text-blue-400",
                      inMonth && !available && dow !== 0 && dow !== 6 && "text-gray-400",
                      inMonth && available && dow === 0 && "text-red-500",
                      inMonth && available && dow === 6 && "text-blue-500",
                      inMonth && available && dow !== 0 && dow !== 6 && "text-gray-700",
                    ]
                      .filter(Boolean)
                      .join(" ")}>
                    {date.getDate()}
                  </span>

                  {/* 선택(초록 네모) */}
                  {chosen && <div className="absolute inset-0 -z-10 rounded-lg bg-green-500" />}

                  {/* 오늘 표시(글자만) – 선택되지 않았을 때만 */}
                  {today && !chosen && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 transform">
                      <div className="text-[9px] font-medium text-green-500">오늘</div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* 시간 선택 */}
          <div className="mb-8 grid grid-cols-3 gap-3">
            {Array.from({ length: 12 }, (_, i) => {
              const hour = 10 + i;
              const timeStr = `${hour}:00`;
              const ok = availableTimes.includes(timeStr);
              const chosen = selectedTime === timeStr;
              return (
                <button
                  key={timeStr}
                  onClick={() => ok && setSelectedTime(timeStr)}
                  disabled={!ok}
                  className={`h-12 rounded-lg border text-sm font-medium transition-colors ${
                    ok
                      ? chosen
                        ? "border-blue-500 bg-blue-500 text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                      : "cursor-not-allowed border-gray-100 bg-gray-50 text-gray-400"
                  }`}>
                  {timeStr}
                </button>
              );
            })}
          </div>

          {/* 예약하기 */}
          <button
            onClick={handleReservation}
            disabled={!selectedDate || !selectedTime}
            className={`h-12 w-full rounded-lg text-base font-bold transition-colors ${
              selectedDate && selectedTime
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "cursor-not-allowed bg-gray-300 text-gray-500"
            }`}>
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}
