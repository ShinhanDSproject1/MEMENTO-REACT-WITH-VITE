import { http } from "@/05-shared/api/https";

/* 이미지 URL을 받아 파일로 다운로드하는 함수 */
export const downloadImage = async (url: string, filename?: string) => {
  try {
    const response = await http.get(url, {
      responseType: "blob",
    });

    // http.get은 응답 데이터를 바로 response.data에 담아줍니다.
    const blob = response.data;

    const blobUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = filename || url.substring(url.lastIndexOf("/") + 1);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("이미지 다운로드 중 오류 발생:", error);
    alert("이미지를 다운로드하는 데 실패했습니다.");
  }
};
