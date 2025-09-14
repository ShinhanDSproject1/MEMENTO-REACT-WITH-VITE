// src/utils/date.ts

/**
 * 문자열을 Date 객체로 변환
 * 허용: ISO("YYYY-MM-DD"), 한국어("YYYY년 MM월 DD일"), 그 외 Date 파싱 가능한 값
 */
export const toDate = (v: string | null | undefined): Date | null => {
  if (!v) return null;

  // ISO (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  // 한국어 포맷 (YYYY년 MM월 DD일)
  const m = v.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);

  // Date 생성자로 파싱 시도
  const dt = new Date(v);
  return isNaN(dt.getTime()) ? null : dt;
};

/**
 * Date 객체 → ISO 포맷 ("YYYY-MM-DD")
 */
export const toISO = (date: Date | null | undefined): string => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

/**
 * ISO 문자열("YYYY-MM-DD") → 한국어 포맷 ("YYYY년 MM월 DD일")
 * 그 외 문자열은 그대로 반환
 */
export const fmtKOR = (v: string | null | undefined): string => {
  if (!v) return "";
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(v);
  if (iso) {
    const [y, m, d] = v.split("-");
    return `${y}년 ${m}월 ${d}일`;
  }
  return v;
};
