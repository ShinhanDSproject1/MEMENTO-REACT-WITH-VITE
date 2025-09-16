import { http, type AppRequestConfig } from "@api/https";

const BASE = "/mentos";

/** 공통 응답 */
export interface ApiResponse<T> {
  code: number;
  status?: number;
  message: string;
  result: T;
}

export interface ReviewItem {
  reviewSeq: number;
  reviewRating: number;
  reviewDate: string; // "YYYY-MM-DD"
  reviewContent: string;
}
export interface MentoProfile {
  mentoName: string;
  mentoImg: string;
  mentoDescription: string;
}
export interface MentosDetailResult {
  mentosImage: string;
  mentosTitle: string;
  mentosLocation: string;
  reviewTotalCnt: number;
  reviewRatingAvg: number;
  reviews: ReviewItem[];
  mento: MentoProfile | MentoProfile[]; // 서버가 배열/객체 혼용 가능성
  mentosDescription: string;
  mentosPrice: number;
}

/** (레거시) 간단 타입 */
export type MentosDetail = {
  mentosSeq: number;
  mentosTitle: string;
  price: number;
};

/**
 * 상세 조회 (기본=로그인 필요 → 토큰 붙임)
 * 공개로 호출하고 싶으면 opts.public = true 로 명시.
 */
export async function getMentosDetail(
  mentosSeq: number,
  opts?: { public?: boolean },
): Promise<MentosDetailResult> {
  const cfg: AppRequestConfig = {};
  if (opts?.public) cfg._skipAuth = true; // 공개 호출만 명시적으로 스킵

  const { data } = await http.get<ApiResponse<MentosDetailResult>>(
    `${BASE}/detail/${mentosSeq}`,
    cfg,
  );

  if (!(data.code === 1000 || data.status === 200)) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }
  return data.result;
}

/** 기존 사용처 호환: 간단 타입으로 매핑 반환 */
export async function fetchMentosDetail(mentosSeq: number): Promise<MentosDetail> {
  const d = await getMentosDetail(mentosSeq);
  return { mentosSeq, mentosTitle: d.mentosTitle, price: Number(d.mentosPrice) };
}
