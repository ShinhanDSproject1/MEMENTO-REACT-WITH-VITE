// 실제 백엔드 주소/응답코드는 팀과 합의해서 바꿔줘
export async function updatePassword({ currentPassword, newPassword }) {
  const res = await fetch("/api/users/password", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ currentPassword, newPassword }),
  });

  if (!res.ok) {
    let data = {};
    try {
      data = await res.json();
    } catch (_) {
      /* noop */
    }
    const err = new Error(data.message || "Password update failed");
    err.code = data.code;
    throw err;
  }
  return res.json().catch(() => ({}));
}
