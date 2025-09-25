import type { SlotsByDate } from "../model";

/**
 * 월별 예약 가능한 슬롯 조회
 */
export async function fetchMonthlySlots(mentosSeq: number, ym: string): Promise<SlotsByDate> {
  const res = await fetch(`/api/mentors/${mentosSeq}/slots?month=${encodeURIComponent(ym)}`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch slots (${res.status})`);
  }
  return res.json();
}
