import type { BareApiResponse, UpdateMentosRequest } from "@entities/mentos";
import { http } from "@/05-shared/api";

export async function updateMentoMentos(
  mentosSeq: number,
  payload: UpdateMentosRequest,
): Promise<BareApiResponse> {
  const form = new FormData();
  form.append(
    "requestDto",
    new Blob([JSON.stringify(payload.requestDto)], { type: "application/json" }),
  );
  if (payload.imageFile) form.append("imageFile", payload.imageFile);

  const { data } = await http.put<BareApiResponse>(`/mentos/${mentosSeq}`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}
