export interface RegisterCertificationRequest {
  certificationName: string; // 자격증명
  certificationImgUrl: string; // 이미지 URL
}

export interface RegisterCertificationResponse {
  code: number;
  status: number;
  message: string;
}
