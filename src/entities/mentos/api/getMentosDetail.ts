import { http, type AppRequestConfig } from "@shared/api";
import type { AxiosRequestHeaders } from "axios";
import type { ApiResponse, MentosDetailResult, SimpleMentosDetail } from "../model/types";

const BASE = "/mentos";

/**
 * 멘토스 상세 조회
 * - 기본: 인증 필요 (액세스 토큰 포함)
 * - 공개 호출: opts.public === true → 인증 스킵
 */
export async function getMentosDetail(
  mentosSeq: number,
  opts?: { public?: boolean },
): Promise<MentosDetailResult> {
  const cfg: AppRequestConfig = {
    headers: {} as AxiosRequestHeaders, // 타입 강제 캐스팅
  };
  if (opts?.public) cfg._skipAuth = true;

  const { data } = await http.get<ApiResponse<MentosDetailResult>>(
    `${BASE}/detail/${mentosSeq}`,
    cfg,
  );

  if (!(data.code === 1000 || data.status === 200)) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }
  return data.result;
}

/** (레거시 호환) 간단 타입으로 매핑 */
export async function fetchMentosDetail(mentosSeq: number): Promise<SimpleMentosDetail> {
  const d = await getMentosDetail(mentosSeq);
  return {
    mentosTitle: d.mentosTitle,
    mentosContent: d.mentosDescription ?? "",
    imageFileName: d.mentosImage ? d.mentosImage.split("/").pop() || "" : "",
    price: Number(d.mentosPrice),
  };
}
