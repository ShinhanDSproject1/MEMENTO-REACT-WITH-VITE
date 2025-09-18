import { http } from "@/shared/api";
import type { ApiEnvelope } from "@entities/profile"; // 프로젝트에 있는 공통 Envelope
import type { UpdateMentoProfileRequest } from "@entities/profile/model/types";

/**
 * 멘토 프로필 수정
 * PATCH /api/mento/mento-profiles
 * multipart/form-data: requestDto(JSON) + imageFile(optional)
 */
export async function updateMentoProfileDetail(
  payload: UpdateMentoProfileRequest,
): Promise<ApiEnvelope<null>> {
  const fd = new FormData();

  // requestDto는 JSON 문자열로 담아야 함
  fd.append(
    "requestDto",
    new Blob([JSON.stringify(payload.requestDto)], { type: "application/json" }),
  );

  // 이미지 파일이 있으면 첨부
  if (payload.imageFile) {
    fd.append("imageFile", payload.imageFile);
  }

  const { data } = await http.patch<ApiEnvelope<null>>("/mento/mento-profiles", fd, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
