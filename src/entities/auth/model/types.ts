// * 유저 타입
export type UserRole = "MENTOR" | "MENTEE" | "ADMIN";

// * 로그인 요청
export interface LoginInput {
  userType: UserRole;
  userid: string;
  password: string;
}

// * 로그인 성공
export interface LoginSuccess {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    role: UserRole;
  };
}

// * 로그아웃 요청
export interface LogoutInput {
  refreshToken: string;
}

// * 로그아웃 성공
export interface LogoutSuccess {
  success: boolean;
}

// * 토큰 재발급
export interface RefreshInput {
  refreshToken: string;
}

// * 토큰 재발급 성공
export interface RefreshSuccess {
  accessToken: string;
  refreshToken?: string;
}

// * 내 정보 확인
export interface Me {
  id: number;
  name: string;
  role: UserRole;
}
