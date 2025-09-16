import { http } from "@/shared/api";
import type { CreateMentosRequest, CreateMentosResponse } from "@entities/mentos";
import { v4 as uuidv4 } from "uuid";

export async function createMentos(input: CreateMentosRequest) {
  const formData = new FormData();
  formData.append("mentosTitle", input.mentosTitle);
  formData.append("mentosContent", input.mentosContent);
  formData.append("categorySeq", String(input.categorySeq));
  formData.append("price", String(input.price));

  if (input.mentosImage) {
    formData.append("mentosImage", input.mentosImage);
  }

  const res = await http.post<CreateMentosResponse>("/mentos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      "idem-Key": uuidv4(), // 고유 멱등 키 생성
    },
  });

  return res.data;
}
