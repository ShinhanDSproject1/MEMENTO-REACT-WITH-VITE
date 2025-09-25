import { toYMD } from "@/05-shared/lib/datetime";
import Holidays from "date-holidays";
import { useMemo } from "react";

export function useKoreanHolidays(year: number) {
  const holidayMap = useMemo(() => {
    const hd = new Holidays("KR");
    const list = hd.getHolidays(year);
    const map = new Map<string, string>();
    list.forEach((h: any) => {
      const key = h.date.slice(0, 10);
      map.set(key, h.name);
    });
    return map;
  }, [year]);

  const isHoliday = (date: Date) => holidayMap.has(toYMD(date));
  const getHolidayName = (date: Date) => holidayMap.get(toYMD(date));

  return { holidayMap, isHoliday, getHolidayName };
}
