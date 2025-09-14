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
  mentosImage: string;
  price: number;
  region: string;
  progressStatus: "진행 전" | "진행 완료"; // 서버 값 그대로 사용
}
