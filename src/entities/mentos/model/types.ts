// * 멘토스 카테고리
export type MentosCategory = "consumption" | "tips" | "saving" | "growth";

// * 전체조회 요청
export interface GetMentosList {
  categoryId?: number;
  limit?: number;
  cursor?: string;
}

// * 전체조회 성공
export interface GetMentosListResponse {
  code: number;
  message: string;
  result: {
    mentos: MentosItem[];
    hasNext: boolean;
    cursor?: string;
  };
}

// * 전체조회 - 멘토스 아이템
export interface MentosItem {
  mentosSeq: number;
  approved: boolean;
  mentosImg: string;
  mentosTitle: string;
  mentosPrice: number;
  region: string; // bname
}

// * 나의 멘토스 조회 요청
export interface GetMyMentosList {
  categoryId?: number;
  limit?: number;
  cursor?: string;
}

// * 나의 멘토스 조회 성공
export interface GetMyMentosResponse {
  code: number;
  status: number;
  message: string;
  result: {
    content: MyMentosItem[];
    nextCursor?: number;
    hasNext: boolean;
  };
}

// * 나의 멘토스 조회 - 멘토스 아이템
export interface MyMentosItem {
  mentosSeq: number;
  mentosTitle: string;
  mentosImage?: string;
  price: number;
  region: string;
  progressStatus: string;
  reservationSeq?: number;
  reviewCompleted: boolean;
}

export type ReportType =
  | "ABUSING"
  | "IDENTITY_THEFT"
  | "FRAUD"
  | "ABUSIVE_LANGUAGE"
  | "COMMERCIAL_AD"
  | "PERSONAL_DATA_ABUSE";

// 서버의 CreateReportRequest에 해당
export interface CreateReportDto {
  reportType: ReportType;
  mentosSeq: number;
}

// 프론트에서 다루기 편한 요청 스펙(멀티파트로 변환 예정)
export interface ReportMentosRequest {
  requestDto: CreateReportDto;
  imageFile?: File | null;
  idemKey: string; // 헤더로 보낼 멱등키
}

// * 멘토스 생성 요청
export interface CreateMentosRequest {
  mentosTitle: string;
  mentosContent: string;
  mentosImage?: File | null;
  categorySeq: number;
  price: number;
}

// * 멘토스 생성 성공
export interface CreateMentosResponse {
  code: number;
  message: string;
  result: {
    mentosSeq: number;
    mentosTitle: string;
    mentosContent: string;
    mentosImage?: string;
    categorySeq: number;
    price: number;
    approved: boolean;
    region: string;
    createdAt: string;
  };
}

/** 공통 응답 래퍼 */
export interface ApiResponse<T> {
  code: number;
  status: number;
  message: string;
  result: T;
}

export interface MentorMentosItem {
  mentosSeq: number;
  mentosTitle: string;
  mentosImage?: string;
  price: number;
  region: string;
  progressStatus?: string | null; // 멘토는 null 가능
}

export interface MentorMentosListResult {
  content: MentorMentosItem[];
  nextCursor?: number;
  hasNext: boolean;
}

/** 멘토스 수정 요청 DTO */
export interface UpdateMentosRequestDto {
  mentosTitle: string;
  mentosContent: string;
  categorySeq: number;
  price: number;
}

/** 멘토스 수정 요청 페이로드 */
export interface UpdateMentosRequest {
  requestDto: UpdateMentosRequestDto;
  imageFile?: File | null;
}

/** 서버 공통 응답(이번 API는 result 없음) */
export type BareApiResponse = {
  code: number;
  status: number;
  message: string;
  timestamp?: string;
};

/* 상세 페이지에 사용되는 타입들 */
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
  mentosSeq: number;
  mentosTitle: string;
  categorySeq: number;
  mentosContent: string;
  mentosImage: string;
  price: number;
}

export interface SimpleMentosDetail {
  mentosTitle: string;
  mentosContent: string;
  imageFileName: string;
  price: number;
}

export type MentorMentosListResponse = ApiResponse<MentorMentosListResult>;
