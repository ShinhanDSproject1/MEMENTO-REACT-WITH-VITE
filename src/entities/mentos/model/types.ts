// * 멘토스 카테고리
export type MentosCategory = "consumption" | "tips" | "saving" | "growth";

export interface MentosItem {
  mentosSeq: number;
  title: string;
  price: number;
  location: string;
  status: "completed" | "pending" | "mento";
  thumbnailUrl?: string;
}

export interface GetMentosListParams {
  category: MentosCategory;
  page?: number;
  size?: number;
}

export interface GetMentosListResponse {
  items: MentosItem[];
  total: number;
  page: number;
  size: number;
}
