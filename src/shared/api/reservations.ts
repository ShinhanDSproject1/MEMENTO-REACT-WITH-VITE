// src/shared/api/reservations.ts
import { http } from "@api/https";

/** 서버 응답 스펙(예시) */
type AvailabilityApiResp = {
  code: number;
  message: string;
  // 서버가 ["18:00","19:00"] 형태이거나 [{startTime:"18:00"}] 형태일 수 있어 안전 처리
  result: Array<string | { startTime?: string; time?: string }>;
};

/** 선택한 날짜의 예약 가능 시간 조회 */
export async function fetchAvailability(
  mentosSeq: number,
  selectedDate: string,
): Promise<string[]> {
  if (mentosSeq === undefined || mentosSeq === null) {
    throw new Error("fetchAvailability: mentosSeq가 없습니다.");
  }
  if (!selectedDate) {
    throw new Error("fetchAvailability: selectedDate가 없습니다.");
  }

  const url = `/reservation/availability/${encodeURIComponent(String(mentosSeq))}`;

  const { data } = await http.get<AvailabilityApiResp>(url, {
    params: { selectedDate },
    // withCredentials: true, // 쿠키 인증을 쓴다면 http 인스턴스 설정에 맞춰 사용
  });

  // 문자열/객체 케이스 공통 처리
  const times =
    data?.result?.map((v) => (typeof v === "string" ? v : (v.startTime ?? v.time ?? ""))) ?? [];

  return times.filter(Boolean);
}
