// ReportType을 한글로 변환하기 위한 Map
const reportTypeMap: { [key: string]: string } = {
  ABUSING: "어뷰징",
  IDENTITY_THEFT: "명의 도용",
  FRAUD: "금전 사기/불법",
  ABUSIVE_LANGUAGE: "부적절한 언행/욕설",
  COMMERCIAL_AD: "스팸/광고",
  PERSONAL_DATA_ABUSE: "개인정보 요구/유출",
};

// API에서 받은 영문 ReportType을 한글로 변환하는 함수
export const translateReportType = (type: string): string => {
  return reportTypeMap[type] || type;
};

// 신고 목록의 개별 아이템 타입
export interface Report {
  reportSeq: number;
  reportType: string;
  reporterName: string;
  reportedMentosTitle: string;
}

// 신고 상세 정보 타입
export interface ReportDetail {
  reportSeq: number;
  reportType: string;
  reportImage: string;
  reporterName: string;
  reportedMentosTitle: string;
}

// 신고 목록 API 응답 타입
export interface ApiResponse {
  result: {
    content: Report[];
  };
}

// 신고 상세 API 응답 타입
export interface ApiDetailResponse {
  result: ReportDetail;
}
