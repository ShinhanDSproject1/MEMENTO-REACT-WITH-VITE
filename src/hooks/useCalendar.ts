import { useMemo, useState } from "react";

export function useCalendar(defaultMonth: Date = new Date()) {
  const [currentMonth, setCurrentMonth] = useState<Date>(defaultMonth);

  const goToPrevMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const goToNextMonth = () =>
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const generateCalendar = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const cur = new Date(startDate);
    // 7* 5(35칸) 구성
    while (days.length < 35) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  };

  const now = useMemo(() => new Date(), []);
  const isToday = (d: Date) =>
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();

  const isPastDate = (d: Date) => d < new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const isCurrentMonth = (d: Date) =>
    d.getFullYear() === currentMonth.getFullYear() && d.getMonth() === currentMonth.getMonth();

  return {
    currentMonth,
    setCurrentMonth,
    goToPrevMonth,
    goToNextMonth,
    generateCalendar,
    isToday,
    isPastDate,
    isCurrentMonth,
  };
}
