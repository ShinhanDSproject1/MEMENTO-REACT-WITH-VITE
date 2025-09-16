import type { RefreshSuccess } from "@entities/auth";
import { http } from "@shared/api";

export async function refresh(): Promise<RefreshSuccess> {
  const { data } = await http.post<RefreshSuccess>("/auth/reissue", null, {
    withCredentials: true,
  });
  return data;
}
