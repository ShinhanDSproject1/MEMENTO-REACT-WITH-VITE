import React, { useState, useMemo, forwardRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import logo from "@/assets/images/memento-logo.svg";
import { ko } from "date-fns/locale";

// ✅ DatePicker가 필요로 하는 ref를 전달하기 위한 숨김 인풋
const HiddenInput = forwardRef(function HiddenInput(props, ref) {
  return (
    <input ref={ref} {...props} className="sr-only" readOnly aria-hidden="true" tabIndex={-1} />
  );
});

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

  // DatePicker 열림 상태
  const [isCalOpen, setIsCalOpen] = useState(false);

  // 전화번호/비번 검증
  const pwOk = pw.length >= 6 && pw === pw2;
  const phoneOk = /^\d{9,13}$/.test(phone.replace(/\D/g, ""));

  // 생년월일 검증(실제 날짜 유효성)
  const birthOk = useMemo(() => {
    if (!/^\d{4}$/.test(birth.y)) return false;
    if (!/^\d{1,2}$/.test(birth.m) || !/^\d{1,2}$/.test(birth.d)) return false;
    const y = Number(birth.y);
    const m = Number(birth.m);
    const d = Number(birth.d);
    const dt = new Date(y, m - 1, d);
    return dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d;
  }, [birth]);

  // 제출 가능 여부
  const canSubmit = useMemo(() => {
    return id.trim() && pwOk && name.trim() && phoneOk && birthOk;
  }, [id, pwOk, name, phoneOk, birthOk]);

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSubmit) return;
    // TODO: 실제 가입 API 호출
    navigate("/signup-complete");
  };

  // DatePicker 선택 값 및 기본 오픈 날짜
  const selectedDate =
    birth.y && birth.m && birth.d
      ? new Date(Number(birth.y), Number(birth.m) - 1, Number(birth.d))
      : null;

  const openToDate = selectedDate ?? new Date(new Date().getFullYear(), new Date().getMonth(), 1);

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
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          />
        </label>

        {/* PW */}
        <label className="block">
          <input
            type="password"
            placeholder="PW입력"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,108,255,0.12)]"
          />
        </label>

        {/* PW 확인 */}
        <label className="block">
          <input
            type="password"
            placeholder="PW확인"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:bg-white focus:shadow-[0_0_0_3px_rgba(47,108,255,0.12)]"
          />
          {!pwOk && pw2 && (
            <p className="mt-1 text-xs text-red-500">비밀번호가 일치하지 않거나 너무 짧습니다.</p>
          )}
        </label>

        {/* 이름 */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.12)]"
          />
        </div>

        {/* 전화번호 */}
        <label className="block">
          <input
            type="tel"
            placeholder="핸드폰 번호  (ex : 010-1234-5678)"
            inputMode="numeric"
            maxLength={13}
            value={phone}
            onChange={(e) => {
              let value = e.target.value.replace(/\D/g, "");
              if (value.length > 3 && value.length <= 7) {
                value = value.replace(/(\d{3})(\d+)/, "$1-$2");
              } else if (value.length > 7) {
                value = value.replace(/(\d{3})(\d{4})(\d+)/, "$1-$2-$3");
              }
              setPhone(value);
            }}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.12)]"
          />
          {!/^010-\d{4}-\d{4}$/.test(phone) && phone && (
            <p className="mt-1 text-xs text-red-500">
              올바른 12자리 핸드폰번호로 입력해주세요.(ex : 010-1234-5678)
            </p>
          )}
        </label>

        {/* 생년월일: 읽기 전용 표시 + 우측 캘린더 버튼 */}
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-600">생년월일</div>

          <div className="relative">
            {/* 4열: 년/월/일 + 버튼 */}
            <div className="grid grid-cols-4 gap-2">
              <input
                placeholder="년도"
                readOnly
                value={birth.y}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <input
                placeholder="월"
                readOnly
                value={birth.m}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <input
                placeholder="일"
                readOnly
                value={birth.d}
                className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
              />
              <button
                type="button"
                onClick={() => setIsCalOpen((v) => !v)}
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#1161FF] shadow-sm hover:bg-slate-50"
                aria-label="생년월일 선택">
                📅 선택
              </button>
            </div>

            {/* 캘린더 팝오버 (인라인 렌더) */}
            {isCalOpen && (
              <>
                {/* 바깥 클릭 닫힘용 오버레이 */}
                <div className="fixed inset-0 z-[9998]" onClick={() => setIsCalOpen(false)} />
                <div className="absolute right-0 z-[9999] mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <DatePicker
                    selected={
                      birth.y && birth.m && birth.d
                        ? new Date(Number(birth.y), Number(birth.m) - 1, Number(birth.d))
                        : null
                    }
                    onChange={(date) => {
                      if (!date) return;
                      setBirth({
                        y: String(date.getFullYear()),
                        m: String(date.getMonth() + 1).padStart(2, "0"),
                        d: String(date.getDate()).padStart(2, "0"),
                      });
                      setIsCalOpen(false); // 날짜 선택하면 닫기
                    }}
                    inline // ✅ 인라인 모드: input/ref 불필요
                    showMonthDropdown
                    showYearDropdown
                    locale={ko}
                    openToDate={
                      birth.y && birth.m
                        ? new Date(Number(birth.y), Number(birth.m) - 1, 1)
                        : new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                  />
                </div>
              </>
            )}
          </div>

          {!birthOk && (birth.y || birth.m || birth.d) && (
            <p className="mt-1 text-xs text-red-500">유효한 생년월일을 선택해주세요.</p>
          )}
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
