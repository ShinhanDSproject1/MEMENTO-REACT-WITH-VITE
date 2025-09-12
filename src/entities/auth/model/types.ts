// * 유저 타입
export type UserRole = "MENTO" | "MENTI" | "ADMIN";

// * 로그인 요청
export interface LoginInput {
  userType: UserRole;
  memberId: string;
  memberPwd: string;
}

// * 로그인 성공
export interface LoginSuccess {
  code: number;
  status: number;
  message: string;
  result: {
    memberName: string;
    memberType: UserRole;
    accessToken?: string; // 나중에 줄 수도 있으니 optional
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

// * 토큰 재발급 성공
export interface RefreshSuccess {
  accessToken: string;
}

// * 내 정보 확인
export interface Me {
  id: number;
  name: string;
  role: UserRole;
}
