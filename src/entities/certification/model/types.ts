export interface RegisterCertificationRequest {
  name: string; // 자격증명
  imageFile?: File; // 첨부 이미지 파일
}

export interface RegisterCertificationResponse {
  code: number;
  status: number;
  message: string;
}
