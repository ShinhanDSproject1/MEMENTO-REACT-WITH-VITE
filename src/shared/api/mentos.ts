import { http } from "@api/https";

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
  /** 상세 응답에는 없을 수 있으므로 옵셔널 */
  reviews?: ReviewItem[];
  /** 서버가 객체/배열 혼용 가능성 */
  mento: MentoProfile | MentoProfile[];
  mentosDescription: string;
  mentosPrice: number;
}

/** (레거시) 간단 타입 */
export type MentosDetail = {
  mentosSeq: number;
  mentosTitle: string;
  price: number;
};

/** 리뷰 페이지네이션 응답 */
export interface ReviewsPage {
  reviews: ReviewItem[];
  hasNext: boolean;
  nextCursor: string | null;
}

/** 상세 조회: 공개 엔드포인트 호출 (토큰 불필요) */
export async function getMentosDetail(mentosSeq: number): Promise<MentosDetailResult> {
  const { data } = await http.get<ApiResponse<MentosDetailResult>>(`${BASE}/detail/${mentosSeq}`);
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

/**
 * 리뷰 무한 스크롤 페이지 조회
 * - hasNext=true -> nextCursor 로 다음 페이지 재호출
 * - limit 디폴트 5
 */
export async function getMentosReviewsPage(
  mentosSeq: number,
  params?: { limit?: number; cursor?: string | null },
): Promise<ReviewsPage> {
  const limit = params?.limit ?? 5;
  const cursor = params?.cursor ?? null;

  const qs = new URLSearchParams();
  qs.set("limit", String(limit));
  if (cursor) qs.set("cursor", cursor);

  const { data } = await http.get<ApiResponse<ReviewsPage>>(
    `${BASE}/detail/${mentosSeq}/reviews?${qs.toString()}`,
  );

  if (!(data.code === 1000 || data.status === 200)) {
    throw new Error(data.message || "리뷰 조회에 실패했습니다.");
  }

  // 응답의 result 안쪽을 정확히 매핑
  return {
    reviews: data.result.reviews,
    hasNext: data.result.hasNext,
    nextCursor: data.result.nextCursor,
  };
}
