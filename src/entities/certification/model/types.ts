export interface RegisterCertificationRequest {
  certificationName: string; // 자격증명
  certificationImgUrl?: File; // 첨부 이미지 파일
}

export interface RegisterCertificationResponse {
  code: number;
  status: number;
  message: string;
}
