// src/pages/booking/Booking.tsx
import { useCalendar, useKoreanHolidays } from "@hooks";
import { Calendar } from "@widgets/booking";
import TimeGrid from "@widgets/booking/TimeGrid";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toYM, toYMD } from "@shared/lib/datetime";
import { useQuery, useMutation } from "@tanstack/react-query";

// ✅ http.ts 없이 axiosAuth 기반 API 함수 사용
import { fetchAvailability } from "@/shared/api/reservations"; // GET /api/reservation/availability/{mentosSeq}?selectedDate=YYYY-MM-DD  → string[]
import { initMentosPayment } from "@api/payments"; // POST /api/mentos/payments/{memberSeq}/init

import { createReservation } from "@/shared/api/reservations";

interface BookingPageProps {
  mentorId?: number; // fallback mentosSeq
  defaultMonth?: Date;
}

export default function BookingPage({ mentorId = 1, defaultMonth = new Date() }: BookingPageProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");

  // URL 쿼리로 mentosSeq 우선 사용 (mentorId/mentosSeq 둘 다 대응)
  const [search] = useSearchParams();
  const qs = search.get("mentorId") ?? search.get("mentosSeq"); // 둘 중 하나가 오도록
  const mentosSeq = qs && !Number.isNaN(Number(qs)) ? Number(qs) : mentorId;
  const memberSeq = Number(localStorage.getItem("memberSeq") || 0); // ✅ 임시 선언(가드 때문에 호출 안됨)
  const isLoggedIn = !!localStorage.getItem("accessToken"); // 임시 로그인 판별

  // 달력 훅
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

  // 오늘 날짜/월 초기 세팅
  useEffect(() => {
    if (selectedDate) return;
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    setSelectedDate(today);
    setCurrentMonth(new Date(now.getFullYear(), now.getMonth(), 1));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthKey]);

  const ymd = selectedDate ? toYMD(selectedDate) : ""; // "YYYY-MM-DD"
  const days = generateCalendar(currentMonth);

  // 가용 시간 조회
  const { data: availableTimes = [], isFetching: isLoadingTimes } = useQuery({
    queryKey: ["availability", mentosSeq, ymd],
    queryFn: () => fetchAvailability(mentosSeq, ymd),
    enabled: !!mentosSeq && !!ymd,
    staleTime: 60_000,
  });

  // 결제 init (명세서: 결제 전 redis에서 예약자 확인)
  const { mutateAsync: initPayment, isPending } = useMutation({
    mutationFn: (payload: { date: string; time: string }) =>
      initMentosPayment(memberSeq, {
        mentosSeq,
        mentosDate: payload.date,
        mentosTime: payload.time,
      }),
  });

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

    // 최종 가드: 현재 가용 목록에 있는지 확인
    if (
      Array.isArray(availableTimes) &&
      availableTimes.length > 0 &&
      !availableTimes.includes(selectedTime)
    ) {
      alert("선택한 시간이 더 이상 예약 불가합니다. 다시 선택해주세요.");
      setSelectedTime("");
      return;
    }

    if (!isLoggedIn) {
      alert("가용 시간 확인은 로그인 없이 가능해요. 예약/결제는 로그인 후 진행해 주세요.");
      return;
    }

    const date = toYMD(selectedDate); // "YYYY-MM-DD"

    try {
      // 1) 예약 생성 (DB insert + Redis 홀드)
      const res = await createReservation({
        mentosSeq,
        mentosDate: date,
        mentosTime: selectedTime,
      });
      if (res.code !== 1000) {
        throw new Error(res?.message || "예약 생성에 실패했습니다.");
      }

      // 2) 결제 init (Redis에서 예약자/슬롯 확인)
      const initRes = await initPayment({ date, time: selectedTime });
      if (initRes?.code !== 1000) {
        throw new Error(initRes?.message || "결제 준비에 실패했습니다.");
      }

      const { successUrl } = initRes.data ?? {};
      if (!successUrl) throw new Error("successUrl이 없습니다.");

      // 3) 결제 페이지로 이동 (또는 위젯 호출)
      window.location.href = successUrl;
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        "처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
      alert(msg);
    }
  };

  const canReserve = !!selectedDate && !!selectedTime && !isLoadingTimes;

  return (
    <div className="flex min-h-full w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5 shadow">
        <h1 className="font-WooridaumB mt-6 mb-[50px] pl-2 text-[20px] font-bold">
          인생 역전, 공격투자 멘토링
        </h1>

        <div className="px-2">
          <Calendar
            currentMonth={currentMonth}
            days={days}
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
            loading={isLoadingTimes}
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
            {isPending ? "처리 중..." : "예약하기"}
          </button>
        </div>
      </section>
    </div>
  );
}
