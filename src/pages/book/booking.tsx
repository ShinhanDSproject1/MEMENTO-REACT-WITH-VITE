import { useEffect, useMemo, useState } from "react";
import Calendar from "../../components/booking/Calendar";
import TimeGrid from "../../components/booking/TimeGrid";
import { useCalendar } from "../../hooks/useCalendar";
import { useKoreanHolidays } from "../../hooks/useKoreanHolidays";
import { toYMD, toYM } from "../../utils/datetime";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  const {
    currentMonth,
    setCurrentMonth,
    goToPrevMonth,
    goToNextMonth,
    generateCalendar,
    isToday,
    isPastDate,
    isCurrentMonth,
  } = useCalendar(defaultMonth);

  const monthKey = useMemo(() => toYM(currentMonth), [currentMonth]);

  // 공휴일
  const { isHoliday, getHolidayName } = useKoreanHolidays(currentMonth.getFullYear());

  // 초기 오늘 선택 + 현재 달 세팅
  useEffect(() => {
    if (selectedDate) return;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    setSelectedDate(today);
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
  }, [monthKey]);

  const days = generateCalendar(currentMonth);

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;
    if (!isCurrentMonth(date)) {
      setCurrentMonth(new Date(date.getFullYear(), date.getMonth(), 1));
    }
    setSelectedDate(date);
    setSelectedTime("");
  };

  const handleReservation = () => {
    if (!selectedDate || !selectedTime) return;
    const payload = {
      title: "인생 한방, 공격투자 멘토링",
      date: toYMD(selectedDate), // "YYYY-MM-DD"
      time: selectedTime, // "HH:mm"
      price: 50000,
      mentorId,
    };
    onReserve?.({ mentorId, date: payload.date, time: payload.time });

    navigate("confirm", { state: payload });
  };

  const canReserve = !!selectedDate && !!selectedTime;

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl bg-white">
        <div className="border-b border-gray-100 px-6 py-4 text-left">
          <h1 className="font-WooridaumB text-base font-medium text-gray-600">
            인생 역전, 공격투자 멘토링
          </h1>
        </div>

        <div className="p-6">
          <Calendar
            currentMonth={currentMonth}
            days={generateCalendar(currentMonth)}
            isToday={isToday}
            isPastDate={isPastDate}
            isHoliday={isHoliday}
            getHolidayName={getHolidayName}
            selectedDate={selectedDate}
            onSelectDate={handleDateClick}
            onPrev={goToPrevMonth}
            onNext={goToNextMonth}
          />

          <TimeGrid
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
          />

          <button
            type="button"
            onClick={handleReservation}
            disabled={!canReserve}
            className={`font-WooridaumB h-14 w-full rounded-2xl text-base font-extrabold text-white shadow transition active:scale-[0.99] ${
              canReserve
                ? "cursor-pointer bg-[#1161FF] hover:bg-[#0C2D62]"
                : "cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300"
            }`}>
            예약하기
          </button>
        </div>
      </div>
    </div>
  );
}
