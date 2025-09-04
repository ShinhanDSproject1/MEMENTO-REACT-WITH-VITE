export type SlotsByDate = Record<string, string[]>;

export interface BookingRequest {
  mentosSeq: number; // 멘토스(클래스) 식별자
  memberSeq: number; // 로그인 회원 식별자
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
}

export interface BookingResponse {
  reservationId: string;
}

export async function fetchMonthlySlots(mentosSeq: number, ym: string): Promise<SlotsByDate> {
  const res = await fetch(`/api/mentors/${mentosSeq}/slots?month=${encodeURIComponent(ym)}`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error(`Failed to fetch slots (${res.status})`);
  return res.json();
}

export async function createReservation(
  req: BookingRequest,
  opts?: { apiKey?: string },
): Promise<BookingResponse> {
  const { mentosSeq, memberSeq, date, time } = req;
  const mentosAt = `${date} ${time}`;

  const res = await fetch(`/reservation/${mentosSeq}/${memberSeq}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(opts?.apiKey ? { "X-API-KEY": opts.apiKey } : {}),
    },
    credentials: "include",
    body: JSON.stringify({ mentosAt }),
  });

  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`Reservation failed (${res.status}) ${t}`);
  }
  return res.json();
}
