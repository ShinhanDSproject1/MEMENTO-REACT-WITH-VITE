// 회원 정보 타입 (API 응답 기준)
export interface MemberInfo {
  memberSeq: number;
  memberName: string;
  memberType: "MENTO" | "MENTI";
  createdAt: string; // "2025-09-18" 형식의 문자열
}

// 회원 목록 API 응답 전체 타입
export interface MemberApiResponse {
  result: {
    members: MemberInfo[];
    nextCursor: number;
    hasNext: boolean;
  };
}

// 날짜 형식을 "YYYY.MM.DD"로 바꿔주는 간단한 함수
export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(-2);
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}.${month}.${day}`;
};
