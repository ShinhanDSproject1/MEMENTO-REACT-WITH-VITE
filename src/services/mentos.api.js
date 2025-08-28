const BASE = "/api/mentos";

// GET(상세 조회) - 지금은 목업
export async function getMentos(id) {
  await new Promise((r) => setTimeout(r, 150));
  // 데이터 없을 수도 있다고 가정
  if (id === "1") {
    return {
      title: "공격적으로 저축하는 법 알려준다!!",
      content: `
            하이 나 김대현이다  이 강의 들어라 
            들으면 하루 만에 백만원 벌 수 있음!!
            거짓말이면 내가 200프로 보장해줌!!!
                `,
      price: "20,000",
      location: "서울 강남구",
    };
  }
  return null;
}

// PUT(수정) - 지금은 콘솔만
export async function updateMentos(id, body) {
  await new Promise((r) => setTimeout(r, 150));
  console.log("PUT /api/mentos/" + id, body);
  return { ok: true };
}
