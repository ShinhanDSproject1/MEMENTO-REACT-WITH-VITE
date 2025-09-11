export type LoginInput = { userType: "mentor" | "mentee"; email: string; password: string };

export type LoginSuccess = {
  accessToken: string;
  refreshToken?: string;
  user: { id: number; name: string; email: string; role?: string };
};

export type RefreshSuccess = { accessToken: string };

export type LogoutSuccess = { ok: boolean };
