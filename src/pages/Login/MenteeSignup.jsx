import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "@/assets/images/memento-logo.svg";

export default function MenteeSignup() {
  const navigate = useNavigate();

  // 폼 상태
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState({ y: "", m: "", d: "" });
  const [agree, setAgree] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);

  // 간단 검증
  const pwOk = pw.length >= 6 && pw === pw2;
  const phoneOk = /^\d{9,13}$/.test(phone.replace(/\D/g, ""));
  const birthOk = /^\d{4}$/.test(birth.y) && /^\d{1,2}$/.test(birth.m) && /^\d{1,2}$/.test(birth.d);

  const canSubmit = useMemo(() => {
    return (
      id.trim() && pwOk && name.trim() && phoneOk && birthOk && verified // 이름 본인인증 완료
    );
  }, [id, pwOk, name, phoneOk, birthOk, verified]);

  const onSelfVerify = async () => {
    // 데모용: 0.7초 후 인증 완료 처리
    setVerifying(true);
    await new Promise((r) => setTimeout(r, 700));
    setVerifying(false);
    setVerified(true);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;

    // TODO: 실제 가입 API 호출
    // api.signup({...})
    navigate("/signup-complete");
  };

  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      {/* 로고 + 인사 */}
      <div className="mb-5 text-center">
        <div className="flex items-center justify-center">
          <img src={logo} className="w-40" />
          <h1 className="mt-2 text-lg font-extrabold">
            <span className="mx-2 text-slate-900">에 오신것을 환영합니다</span>
          </h1>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          멘토와 함께 하는 스마트한 금융 여정을 시작하세요
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* ID */}
        <label className="block">
          <input
            type="text"
            placeholder="ID입력"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full rounded-2xl border border-[#5B8BFF] bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          />
        </label>

        {/* PW */}
        <label className="block">
          <input
            type="password"
            placeholder="PW입력"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,108,255,0.12)]"
          />
        </label>

        {/* PW 확인 */}
        <label className="block">
          <input
            type="password"
            placeholder="PW확인"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,108,255,0.12)]"
          />
          {!pwOk && pw2 && (
            <p className="mt-1 text-xs text-red-500">비밀번호가 일치하지 않거나 너무 짧습니다.</p>
          )}
        </label>

        {/* 이름 + 본인인증 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setVerified(false);
            }}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.12)]"
          />
          <button
            type="button"
            onClick={onSelfVerify}
            disabled={!name.trim() || verifying}
            className={[
              "h-12 rounded-2xl px-4 text-sm font-bold text-white",
              name.trim() && !verifying ? "bg-[#1161FF] hover:bg-[#0C2D62]" : "bg-[#9BB9FF]",
            ].join(" ")}>
            {verified ? "인증완료" : verifying ? "인증중..." : "본인인증"}
          </button>
        </div>

        {/* 전화번호 */}
        <label className="block">
          <input
            type="tel"
            placeholder="전화번호"
            inputMode="numeric"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d-]/g, ""))}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.12)]"
          />
          {!phoneOk && phone && (
            <p className="mt-1 text-xs text-red-500">숫자 9~13자리로 입력해주세요.</p>
          )}
        </label>

        {/* 생년월일 */}
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-600">생년월일</div>
          <div className="grid grid-cols-3 gap-2">
            <input
              placeholder="년도"
              inputMode="numeric"
              maxLength={4}
              value={birth.y}
              onChange={(e) => setBirth({ ...birth, y: e.target.value.replace(/\D/g, "") })}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF]"
            />
            <input
              placeholder="월"
              inputMode="numeric"
              maxLength={2}
              value={birth.m}
              onChange={(e) => setBirth({ ...birth, m: e.target.value.replace(/\D/g, "") })}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF]"
            />
            <input
              placeholder="일"
              inputMode="numeric"
              maxLength={2}
              value={birth.d}
              onChange={(e) => setBirth({ ...birth, d: e.target.value.replace(/\D/g, "") })}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF]"
            />
          </div>
        </div>

        {/* 약관 동의 */}
        <label className="mt-2 flex items-center gap-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e) => setAgree(e.target.checked)}
            className="h-5 w-5 rounded border-slate-300 text-[#1161FF] focus:ring-[#1161FF]"
          />
          <span className="text-sm">
            <Link to="/tos" className="font-bold text-slate-600 underline underline-offset-2">
              이용약관
            </Link>{" "}
            및{" "}
            <Link to="/privacy" className="font-bold text-slate-600 underline underline-offset-2">
              개인정보처리방침
            </Link>
            에 동의합니다
          </span>
        </label>

        {/* 버튼들 */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="submit"
            disabled={!canSubmit}
            className={[
              "h-14 rounded-2xl text-base font-extrabold text-white transition",
              canSubmit ? "bg-[#1161FF] hover:bg-[#0C2D62]" : "cursor-not-allowed bg-[#9BB9FF]",
            ].join(" ")}>
            가입
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-14 rounded-2xl bg-slate-200 text-base font-extrabold text-slate-500 transition hover:bg-slate-300">
            취소
          </button>
        </div>

        {/* 로그인 링크 */}
        <p className="mt-6 text-center text-sm text-slate-500">
          이미 계정이 있으신가요?{" "}
          <Link to="/login" className="font-bold text-[#1161FF] underline underline-offset-2">
            로그인
          </Link>
        </p>
      </form>
    </main>
  );
}
