import { useCalendar, useKoreanHolidays } from "@hooks";
import { Calendar } from "@widgets/booking";
import TimeGrid from "@widgets/booking/TimeGrid";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toYM, toYMD } from "@shared/lib/datetime";
import { useQuery, useMutation } from "@tanstack/react-query";
import { fetchAvailability } from "@/shared/api/reservations";
import { initMentosPayment } from "@api/payments";

interface Booking {
  mentorId: number;
  date: string;
}

interface BookingPageProps {
  mentorId?: number;
  defaultMonth?: Date;
  onReserve?: (payload: Booking) => void;
}

export default function BookingPage({
  mentorId = 1,
  defaultMonth = new Date(),
  // onReserve,
}: BookingPageProps) {
  // const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // 서버에서 가용 시간 조회
  const ymd = selectedDate ? toYMD(selectedDate) : ""; // "YYYY-MM-DD"

  const [search] = useSearchParams();
  const qs = search.get("mentorId") ?? search.get("mentosSeq");
  const mentosSeq = qs && !Number.isNaN(Number(qs)) ? Number(qs) : mentorId;

  const { data: availableTimes = [] } = useQuery({
    queryKey: ["availability", mentosSeq, ymd],
    queryFn: () => fetchAvailability(mentosSeq, ymd), // ✅ mentosSeq, ymd 전달
    enabled: !!mentosSeq && !!ymd,
  });

  const { mutateAsync: initPayment, isPending } = useMutation({
    mutationFn: (payload: { date: string; time: string }) =>
      initMentosPayment(
        1, // TODO: 로그인 연동 후 실제 memberSeq로 교체
        {
          mentosSeq: mentosSeq,
          mentosAt: payload.date,
          mentosTime: payload.time,
        },
      ),
  });

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

  const handleReservation = async () => {
    if (!selectedDate || !selectedTime) return;
    if (!availableTimes.includes(selectedTime)) {
      alert("선택한 시간이 더 이상 예약 불가합니다. 다시 선택해주세요.");
      setSelectedTime("");
      return;
    }
    const date = toYMD(selectedDate);
    try {
      const res = await initPayment({ date, time: selectedTime });
      const { successUrl } = res.result;
      window.location.href = successUrl;
    } catch (e: any) {
      alert(e?.message ?? "예약 초기화에 실패했습니다.");
    }
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
            availableTimes={availableTimes}
          />

          <button
            type="button"
            onClick={handleReservation}
            disabled={!canReserve || isPending}
            className={`font-WooridaumB h-14 w-full rounded-2xl text-base font-extrabold text-white shadow transition active:scale-[0.99] ${
              canReserve
                ? "cursor-pointer bg-[#1161FF] hover:bg-[#0C2D62]"
                : "cursor-not-allowed bg-gray-300 text-gray-500 hover:bg-gray-300"
            }`}>
            예약하기
          </button>
        </div>
      </section>
    </div>
  );
}
