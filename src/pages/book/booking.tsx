import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCalendar } from "../../hooks/useCalendar";
import { useKoreanHolidays } from "../../hooks/useKoreanHolidays";
import { toYM, toYMD } from "../../shared/lib/datetime";
import Calendar from "../../widgets/booking/Calendar";
import TimeGrid from "../../widgets/booking/TimeGrid";

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
  const { isHoliday, getHolidayName } = useKoreanHolidays(
    currentMonth.getFullYear()
  );

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
      date: toYMD(selectedDate),
      time: selectedTime,
      price: 50000,
      mentorId,
    };
    onReserve?.({ mentorId, date: payload.date, time: payload.time });

    navigate("confirm", { state: payload });
  };

  const canReserve = !!selectedDate && !!selectedTime;

  return (
    <div className="flex min-h-full w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5 shadow">
        <h1 className="font-WooridaumB mt-6 mb-[50px] pl-2 text-[20px] font-bold">
          인생 역전, 공격투자 멘토링
        </h1>

        <div className="px-2">
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
            }`}
          >
            예약하기
          </button>
        </div>
      </section>
    </div>
  );
}
