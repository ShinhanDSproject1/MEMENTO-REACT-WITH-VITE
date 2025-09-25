import type { LogoutSuccess } from "@entities/auth";
import { http } from "@shared/api";
import { disconnectSocket } from "@/pages/chat/services/chatSocket"; // 1. chatSocket에서 disconnectSocket 함수를 가져옵니다.

export async function logout(): Promise<LogoutSuccess> {
  // 2. 로그아웃 API 호출 전에 WebSocket 연결을 먼저 끊습니다.
  disconnectSocket();

  const { data } = await http.post<LogoutSuccess>("/auth/logout", null, {
    withCredentials: true,
  });

  return data;
}
