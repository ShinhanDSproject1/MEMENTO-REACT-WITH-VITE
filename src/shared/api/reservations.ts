// src/shared/api/reservations.ts
import { http } from "@api/https";

export type Availability = {
  startTime: string; // "10:00"
  endTime: string; // "18:00"
  availableTime: string[]; // ["11:00","13:00","14:00"]
};

// 로그인 불필요 → fetch 사용
// GET /api/reservation/availability/{mentosSeq}?selectedDate=YYYY-MM-DD
export async function fetchAvailability(
  mentosSeq: number,
  selectedDate: string,
): Promise<Availability> {
  const rsp = await fetch(
    `/api/reservation/availability/${mentosSeq}?selectedDate=${encodeURIComponent(selectedDate)}`,
    { credentials: "include" },
  );
  const data = await rsp.json();
  const res = data?.result ?? data;

  return {
    startTime: res?.startTime ?? "10:00",
    endTime: res?.endTime ?? "21:00",
    availableTime: Array.isArray(res?.availableTime) ? res.availableTime.map(String) : [],
  };
}

// 로그인 필요 → axios(http) 사용
// POST /api/reservation
export async function createReservation(payload: {
  mentosSeq: number;
  mentosAt: string; // "YYYY-MM-DD"
  mentosTime: string; // "HH:mm"
}) {
  const { data } = await http.post("/reservation", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data?.result ?? data;
}
