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
