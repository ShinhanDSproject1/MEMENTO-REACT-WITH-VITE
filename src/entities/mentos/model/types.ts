// * 멘토스 카테고리
export type MentosCategory = "consumption" | "tips" | "saving" | "growth";

export interface MentosItem {
  mentosSeq: number;
  approved: boolean;
  mentosImg: string;
  mentosTitle: string;
  mentosPrice: number;
  region: string; // bname
}

export interface GetMentosListParams {
  categoryId?: number;
  limit?: number;
  cursor?: number;
}

export interface GetMentosListResponse {
  code: number;
  message: string;
  result: {
    mentos: MentosItem[];
    hasNext: boolean;
  };
}
