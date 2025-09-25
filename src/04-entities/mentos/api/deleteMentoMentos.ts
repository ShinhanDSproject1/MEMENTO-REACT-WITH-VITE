// src/entities/mentos/api/deleteMentoMentos.ts
import { http } from "@/05-shared/api";
import type { BareApiResponse } from "../model/types";

/**
 * 멘토가 자신의 멘토스를 삭제(비활성화)
 * @param mentosSeq 멘토스 식별자
 */
export async function deleteMentoMentos(mentosSeq: number): Promise<BareApiResponse> {
  const { data } = await http.patch<BareApiResponse>(`/mentos/${mentosSeq}`);
  return data;
}
