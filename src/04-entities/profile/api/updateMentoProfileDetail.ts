import { http } from "@/05-shared/api";
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

  const dto = {
    ...payload.requestDto,
    mentoPostcode: payload.requestDto.mentoPostcode ?? "",
    mentoRoadAddress: payload.requestDto.mentoRoadAddress ?? "",
    mentoBname: payload.requestDto.mentoBname ?? "",
    mentoDetail: payload.requestDto.mentoDetail ?? "",
  };

  fd.append("requestDto", new Blob([JSON.stringify(dto)], { type: "application/json" }));

  if (payload.imageFile) {
    fd.append("imageFile", payload.imageFile, payload.imageFile.name);
  }

  const { data } = await http.patch<ApiEnvelope<null>>("/mento/mento-profiles", fd);
  return data;
}
