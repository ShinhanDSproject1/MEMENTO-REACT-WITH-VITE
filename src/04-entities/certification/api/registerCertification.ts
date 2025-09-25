import { http } from "@/05-shared";
import type { RegisterCertificationRequest, RegisterCertificationResponse } from "../model/types";

export async function registerCertification(
  req: RegisterCertificationRequest,
): Promise<RegisterCertificationResponse> {
  const payload: RegisterCertificationRequest = {
    certificationName: req.certificationName,
    certificationImgUrl: req.certificationImgUrl,
  };

  const { data } = await http.post<RegisterCertificationResponse>(
    "/mento/mento-certifications",
    payload,
    {
      headers: {
        "Content-Type": "application/json",
        "Idem-Key": crypto.randomUUID(), // 중복 방지 키 (옵션)
      },
    },
  );

  return data;
}
