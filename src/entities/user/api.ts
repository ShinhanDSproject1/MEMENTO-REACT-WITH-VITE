import {
  UpdatePasswordError,
  type UpdatePasswordErrorBody,
  type UpdatePasswordInput,
  type UpdatePasswordSuccess,
} from "./model";

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

  if (!res.ok) {
    let data: UpdatePasswordErrorBody | undefined;
    try {
      data = await res.json();
    } catch {}
    throw new UpdatePasswordError(data?.message ?? "Password update failed", {
      code: data?.code,
      status: res.status,
    });
  }

  try {
    return (await res.json()) as UpdatePasswordSuccess;
  } catch {
    return {};
  }
}
