// src/services/userService.ts

export interface UpdatePasswordInput {
  currentPassword: string;
  newPassword: string;
}

export interface UpdatePasswordSuccess {
  ok?: boolean; // 서버가 { ok: true } 등을 줄 수 있으니 옵션
  message?: string; // 성공 메시지를 주는 서버도 있어 옵션
}

export interface UpdatePasswordErrorBody {
  message?: string;
  code?: string; // 서버에서 에러 코드를 내려줄 수 있음
}

// 커스텀 에러 타입 (Error 확장)
export class UpdatePasswordError extends Error {
  code?: string;
  status: number;

  constructor(message: string, options?: { code?: string; status?: number }) {
    super(message);
    this.name = "UpdatePasswordError";
    this.code = options?.code;
    this.status = options?.status ?? 0;
  }
}

// 실제 백엔드 주소/응답코드는 팀 합의에 맞게 바꿔주세요.
export async function updatePassword({
  currentPassword,
  newPassword,
}: UpdatePasswordInput): Promise<UpdatePasswordSuccess> {
  const res = await fetch("/api/users/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  // 실패 처리
  if (!res.ok) {
    let data: UpdatePasswordErrorBody | undefined;
    try {
      data = (await res.json()) as UpdatePasswordErrorBody;
    } catch {
      // 응답이 JSON이 아닐 수도 있음 -> 무시
    }

    throw new UpdatePasswordError(data?.message || "Password update failed", {
      code: data?.code,
      status: res.status,
    });
  }

  // 성공 처리 (본문이 없을 수도 있으니 안전하게)
  try {
    const body = (await res.json()) as UpdatePasswordSuccess;
    return body ?? {};
  } catch {
    return {};
  }
}
