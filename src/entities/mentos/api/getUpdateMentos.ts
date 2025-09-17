import type { MentosDetailResult } from "@entities/mentos";
import { http } from "@shared/api";

export async function getUpdateMentos(mentosSeq: number): Promise<MentosDetailResult> {
  const { data } = await http.get<{
    code: number;
    status: number;
    message: string;
    result: MentosDetailResult;
  }>(`/mentos/${mentosSeq}`);

  if (data.code !== 1000) {
    throw new Error(data.message || "멘토스 상세 조회 실패");
  }
  return data.result;
}
