import { http } from "@/shared";
import type { RegisterCertificationRequest, RegisterCertificationResponse } from "../model/types";

export async function registerCertification(
  req: RegisterCertificationRequest,
): Promise<RegisterCertificationResponse> {
  const form = new FormData();

  // requestDto JSON → Blob으로 감싸서 append
  form.append(
    "requestDto",
    new Blob([JSON.stringify({ name: req.name })], { type: "application/json" }),
  );

  // 이미지 파일이 있으면 첨부
  if (req.imageFile) {
    form.append("imageFile", req.imageFile, req.name);
  }

  const { data } = await http.post<RegisterCertificationResponse>(
    "/mento/mento-certifications",
    form,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        "Idem-Key": crypto.randomUUID(), // 중복 방지 키 (옵션)
      },
    },
  );

  return data;
}
