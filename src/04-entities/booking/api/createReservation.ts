import type { BookingRequest, BookingResponse } from "../model";

/**
 * 예약 생성
 */
export async function createReservation(
  req: BookingRequest,
  opts?: { apiKey?: string },
): Promise<BookingResponse> {
  const { mentosSeq, memberSeq, date, time } = req;

  const res = await fetch(`/reservation/${mentosSeq}/${memberSeq}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(opts?.apiKey ? { "X-API-KEY": opts.apiKey } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ mentosAt: `${date} ${time}` }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Reservation failed (${res.status}) ${t}`);
  }

  return res.json();
}
