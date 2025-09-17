import { http } from "@api/https";

export type Availability = {
  startTime: string;
  endTime: string;
  availableTime: string[];
};

// 로그인 불필요 → fetch 사용
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

export async function createReservation(payload: {
  mentosSeq: number;
  mentosAt: string;
  mentosTime: string;
}) {
  const { data } = await http.post("/reservation", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return data?.result ?? data;
}
