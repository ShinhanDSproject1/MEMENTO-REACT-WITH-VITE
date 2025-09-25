import { http } from "@/05-shared";
import { v4 as uuidv4 } from "uuid";
import type { CreateReviewBody, CreateReviewResponse } from "../model/types";

export async function createReview(body: CreateReviewBody): Promise<CreateReviewResponse> {
  const { data } = await http.post<CreateReviewResponse>("/mypage/reviews", body, {
    headers: { "Idem-Key": uuidv4() },
  });
  return data;
}
