export interface MentorReview {
  reviewId: number;
  mentosTitle: string;
  reviewRating: number;
  mentiName: string;
  reviewContent: string;
  createdAt: string; // YYYY-MM-DD
}

export interface MentorReviewsResult {
  content: MentorReview[];
  hasNext: boolean;
  nextCursor: number | null;
}

export type CreateReviewBody = {
  mentosSeq: number;
  reviewRating: number;
  reviewContent: string;
};

export type CreateReviewResponse = {
  code: number;
  status: number;
  message: string;
};
