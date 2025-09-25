import { http } from "@/05-shared/api/https";

export type Availability = {
  startTime: string;
  endTime: string;
  availableTime: string[];
};

export async function fetchAvailability(
  mentosSeq: number,
  selectedDate: string,
): Promise<Availability> {
  const { data } = await http.get(`/reservation/availability/${mentosSeq}`, {
    params: { selectedDate },
    headers: {
      "Content-Type": "application/json",
      // Authorization 헤더가 http 인스턴스에서 자동 주입되지 않는 경우 직접 추가하세요:
      // Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    },
  });

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
