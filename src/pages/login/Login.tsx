import character from "@assets/images/character/character-full-dance.svg";
import logo from "@assets/images/logo/memento-logo.svg";
import { useAuth } from "@entities/auth";
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";

type Role = "mentor" | "menti";

const REDIRECT_KEY = "postLoginRedirect";
const buildPath = (
  loc?: Partial<Location> & { pathname?: string; search?: string; hash?: string },
) => (loc?.pathname ? `${loc.pathname}${loc.search ?? ""}${loc.hash ?? ""}` : "/");

export default function Login() {
  const [role, setRole] = useState<Role>("mentor");
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ 전역 auth 액션 사용
  const location = useLocation() as { state?: { from?: Location } };

  // ✅ (추가) 로그인 페이지 진입 시, 보호 라우트가 넘겨준 from을 세션에 백업(소셜 로그인 대비)
  useEffect(() => {
    const from = location.state?.from;
    if (from) {
      sessionStorage.setItem(REDIRECT_KEY, buildPath(from));
    }
  }, [location.state]);

  // ✅ (추가) 최종 리다이렉트 목적지 계산: state.from → 세션 백업 → "/"
  const redirectTarget = useMemo(() => {
    const from = location.state?.from;
    return buildPath(from) || sessionStorage.getItem(REDIRECT_KEY) || "/";
  }, [location.state]);

  // * 입력값, 로딩중 아닐때
  const canSubmit = !!(id.trim() && pw.trim()) && !loading;

  // * 로그인 폼 제출 이벤트 핸들러
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit) return;

    setLoading(true);
    setErrorMsg(null);

    try {
      // role -> 서버의 userType (대문자)로 매핑
      const userType = role === "mentor" ? "MENTO" : "MENTI";

      await login({
        userType,
        memberId: id,
        memberPwd: pw,
      });

      // 로그인 성공 → 홈으로 이동 (필요시 리다이렉트 대상 바꿔도 OK)
      sessionStorage.removeItem(REDIRECT_KEY);
      navigate(redirectTarget, { replace: true });
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      const msg =
        error?.response?.data?.message ||
        error?.message ||
        "아이디 또는 비밀번호가 올바르지 않습니다.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const TypeBtn = ({ value, label }: { value: Role; label: string }) => {
    const active = role === value;
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => setRole(value)}
        className={[
          "w-25 rounded-full px-5 py-2 text-sm font-semibold transition-all",
          active
            ? "bg-[#1161FF] text-white shadow-[0_5px_10px_rgba(17,97,255,0.35)]"
            : "bg-white text-slate-600 ring-1 ring-slate-300 hover:bg-slate-50",
        ].join(" ")}>
        {label}
      </button>
    );
  };

  return (
    <div className="mx-10 mt-8 pb-10">
      {/* 로고/안내 텍스트 */}
      <img src={logo} alt="memento logo" className="w-[150px]" />
      <p className="font-WooridaumB mt-5 text-left text-[1.35rem] font-semibold text-[#121418]">
        안녕하세요 me:mento 입니다.
      </p>
      <p className="font-WooridaumB text-left text-[0.9rem] text-[#757575]">
        나만의 재테크 멘토링을 시작해보세요!
      </p>

      {/* 캐릭터 이미지 */}
      <img
        src={character}
        alt="character full"
        className="mx-auto w-[18.75rem] animate-[floaty_3s_ease-in-out_infinite] pt-2"
      />

      {/* 멘토/멘티 선택 버튼 */}
      <div className="mb-6 flex items-center justify-center gap-3 pt-1">
        <TypeBtn value="mentor" label="멘토" />
        <TypeBtn value="menti" label="멘티" />
      </div>

      {/* ID/PW 입력 폼 */}
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="sr-only">아이디</span>
          <input
            type="text"
            inputMode="email"
            autoComplete="username"
            placeholder="ID 입력"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm ring-0 outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          />
        </label>

        <label className="block">
          <span className="sr-only">비밀번호</span>
          <input
            type="password"
            autoComplete="current-password"
            placeholder="PW 입력"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          />
        </label>

        {/* 회원가입 / 아이디찾기 / 비밀번호찾기 */}
        <div className="mt-2 flex items-center justify-between text-[13px] text-slate-500 underline underline-offset-2">
          <button type="button" onClick={() => navigate("/signup")} className="hover:text-black">
            회원가입
          </button>
          <button type="button" onClick={() => navigate("/find-id")} className="hover:text-black">
            아이디찾기
          </button>
          <button
            type="button"
            onClick={() => navigate("/find-password")}
            className="hover:text-black">
            비밀번호찾기
          </button>
        </div>

        {/* 에러 메세지 */}
        {errorMsg && <p className="text-sm text-[#DF001F]">* {errorMsg}</p>}

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={!canSubmit}
          className={[
            "w-full rounded-2xl px-6 py-3 text-center text-base font-bold text-white transition-all",
            canSubmit ? "bg-[#1161FF] hover:bg-[#0C2D62]" : "cursor-not-allowed bg-[#9BB9FF]",
          ].join(" ")}>
          {loading ? "로그인 중..." : "로그인"}
        </button>
      </form>
    </div>
  );
}
