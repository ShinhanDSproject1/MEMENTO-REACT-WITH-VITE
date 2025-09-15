// src/shared/api/reservations.ts
import { axiosAuth } from "./axiosAuth";

// ---------- 예약 생성 ----------
export type CreateReservationReq = {
  mentosSeq: number;
  mentosDate: string; // "YYYY-MM-DD"
  mentosTime: string; // "HH:mm"
};
export type CreateReservationRes = {
  code: number;
  status: number;
  message: string;
  data?: { reservationSeq: number };
};

export async function createReservation(body: CreateReservationReq) {
  return axiosAuth<CreateReservationRes>({
    url: "/reservation",
    method: "POST",
    data: body,
  });
}

// ---------- 예약 가용 시간 조회 ----------
type AvailabilityResponse = {
  code: number;
  message: string;
  result: {
    startTime: string;
    endTime: string;
    availableTime: string[];
  };
};

// GET /api/reservation/availability/{mentosSeq}?selectedDate=YYYY-MM-DD
export async function fetchAvailability(
  mentosSeq: number,
  selectedDate: string,
): Promise<string[]> {
  if (!mentosSeq || !selectedDate) return [];

  const res = await fetch(
    `/api/reservation/availability/${encodeURIComponent(String(mentosSeq))}?selectedDate=${encodeURIComponent(selectedDate)}`,
    { method: "GET" },
  );

  if (!res.ok) {
    console.error("예약 가능 시간 조회 실패:", res.status);
    return [];
  }

  const data: AvailabilityResponse = await res.json();
  return data.result?.availableTime ?? [];
}
