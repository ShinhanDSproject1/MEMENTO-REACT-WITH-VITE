import type { ReportMentosRequest } from "@entities/mentos/model/types";
import { http } from "@/05-shared/api";

/**
 * 신고하기 요청
 * POST /reports (multipart/form-data)
 */
export async function createReport(req: ReportMentosRequest) {
  const form = new FormData();

  // JSON -> Blob 변환하여 "requestDto" 파트로 첨부
  form.append(
    "requestDto",
    new Blob([JSON.stringify(req.requestDto)], { type: "application/json" }),
  );

  // 파일이 있으면 첨부
  if (req.imageFile) {
    form.append("imageFile", req.imageFile);
  }

  // http 인스턴스로 요청 (axios.post와 동일한 시그니처)
  const { data } = await http.post("/manager/reports", form, {
    headers: {
      "Content-Type": "multipart/form-data",
      "Idem-Key": req.idemKey, // 멱등키
    },
  });

  return data;
}
