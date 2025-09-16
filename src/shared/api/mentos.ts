import { http } from "./https";
const BASE = "/api/mentos";

/** 공통 응답 래퍼 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  result: T;
}

export interface MentosItem {
  title: string;
  content: string;
  price: string;
  location: string;
}

/** 리뷰 단건 */
export interface ReviewItem {
  reviewSeq: number;
  reviewRating: number;
  reviewDate: string; // "YYYY-MM-DD"
  reviewContent: string;
}

/** 멘토 프로필 */
export interface MentoProfile {
  mentoName: string;
  mentoImg: string;
  mentoDescription: string;
}

/** 멘토스 상세 결과 */
export interface MentosDetailResult {
  mentosImage: string;
  mentosTitle: string;
  mentosLocation: string;
  reviewTotalCnt: number;
  reviewRatingAvg: number;
  reviews: ReviewItem[];
  mento: MentoProfile;
  mentosDescription: string;
  mentosPrice: number;
}

/** 상세 조회: GET /api/mentos/detail/{mentosSeq} */
export async function getMentosDetail(mentosSeq: number): Promise<MentosDetailResult> {
  const { data } = await http.get<ApiResponse<MentosDetailResult>>(`/mentos/detail/${mentosSeq}`);
  console.log(`[API]-> code=${data.code}, message="${data.message}"`);
  // 성공 코드 체크
  if (data.code !== 1000) {
    throw new Error(data.message || "요청에 실패했습니다.");
  }

  return data.result;
}

// PUT(수정) - 지금은 콘솔만
export async function updateMentos(
  id: string,
  body: Partial<MentosItem>, // 일부만 수정할 수 있도록 Partial
): Promise<{ ok: boolean }> {
  await new Promise((r) => setTimeout(r, 150));
  console.log("PUT", `${BASE}/${id}`, body);
  return { ok: true };
}
