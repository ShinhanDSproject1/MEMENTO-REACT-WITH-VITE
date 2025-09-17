// src/pages/MentorSignup.tsx
import logo from "@assets/images/logo/memento-logo.svg";
import { ko } from "date-fns/locale";
import React, {
  forwardRef,
  useMemo,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ForwardedRef,
} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link, useNavigate } from "react-router-dom";

// ✅ DatePicker 등에 넘길 수 있는 숨김 input (지금은 사용 안 하지만 보관)
const HiddenInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref: ForwardedRef<HTMLInputElement>) => (
    <input ref={ref} {...props} className="sr-only" readOnly aria-hidden="true" tabIndex={-1} />
  ),
);

type Birth = { y: string; m: string; d: string };

export default function MentorSignup() {
  const navigate = useNavigate();

  // 폼 상태
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [pw2, setPw2] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [birth, setBirth] = useState<Birth>({ y: "", m: "", d: "" });

  const [certOwn, setCertOwn] = useState<boolean>(false); // true: 보유, false: 미보유
  const [certFile, setCertFile] = useState<File | null>(null);

  const [agree, setAgree] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [certName, setCertName] = useState<string>("");

  // DatePicker 열림 상태
  const [isCalOpen, setIsCalOpen] = useState<boolean>(false);

  // 전화번호/비번 검증
  const pwOk = pw.length >= 6 && pw === pw2;
  const phoneOk = /^010-\d{4}-\d{4}$/.test(phone);

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

  const canSubmit = useMemo(() => {
    return (
      id.trim() !== "" &&
      pwOk &&
      name.trim() !== "" &&
      phoneOk &&
      birthOk &&
      (certOwn === false || (certOwn === true && !!certFile)) &&
      agree
    );
  }, [id, pwOk, name, phoneOk, birthOk, certOwn, certFile, agree]);

  // ✅ 실제 가입 API
  const submitSignup = async () => {
    const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

    // 파일 외에는 기본 회원 정보만 담음
    const requestDto = {
      memberId: id.trim(),
      memberPwd: pw,
      memberName: name.trim(),
      memberPhoneNumber: phone,
      memberBirthDate: `${birth.y}-${birth.m.padStart(2, "0")}-${birth.d.padStart(2, "0")}`,
    };

    const form = new FormData();
    form.append("requestDto", new Blob([JSON.stringify(requestDto)], { type: "application/json" }));

    // 자격증 보유일 때만 파일 첨부
    if (certOwn && certFile) {
      form.append("imageFile", certFile);
    }

    const res = await fetch(`${BASE}/auth/signup/mento`, {
      method: "POST",
      body: form,
      credentials: "include",
      headers: {
        "Idem-Key": "testIdempotencyKey",
      },
    });

    let payload: any = null;
    try {
      payload = await res.json();
    } catch {
      /* 바디가 없을 수도 있음 */
    }
    if (!res.ok) {
      const err: any = new Error(payload?.message || `가입 실패 (${res.status})`);
      err.status = res.status;
      throw err;
    }
    return payload;
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setErrorMsg("");
    setSubmitting(true);

    try {
      await submitSignup();
      navigate("/signup-complete");
    } catch (err: any) {
      const status = err?.response?.status ?? err?.status;
      if (status === 409) setErrorMsg("이미 존재하는 아이디입니다.");
      else if (status === 400) setErrorMsg("입력값을 다시 확인해주세요.");
      else setErrorMsg(err?.message ?? "서버 오류가 발생했습니다.");
    } finally {
      setSubmitting(false);
    }
  };

  // DatePicker 선택 값
  const selectedDate: Date | null =
    birth.y && birth.m && birth.d
      ? new Date(Number(birth.y), Number(birth.m) - 1, Number(birth.d))
      : null;

  return (
    <main className="mx-auto w-full max-w-md px-5 py-8">
      {/* 로고 + 인사 */}
      <div className="mb-5 text-center">
        <div className="flex items-center justify-center">
          <img src={logo} className="w-40" />
          <h1 className="mt-2 text-sm font-extrabold">
            <span className="mx-2 text-slate-900">에 오신것을 환영합니다</span>
          </h1>
        </div>
        <p className="mt-2 text-sm text-slate-500">
          멘티와 함께 하는 스마트한 금융 여정을 시작하세요
        </p>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* ID */}
        <label className="block">
          <input
            type="text"
            placeholder="ID 입력"
            value={id}
            onChange={(e) => setId(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          />
        </label>

        {/* PW */}
        <label className="block">
          <input
            type="password"
            placeholder="PW 입력"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          />
        </label>

        {/* PW 확인 */}
        <label className="block">
          <input
            type="password"
            placeholder="PW 확인"
            value={pw2}
            onChange={(e) => setPw2(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
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
            className="flex-1 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
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
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          />
          {!/^010-\d{4}-\d{4}$/.test(phone) && phone && (
            <p className="mt-1 text-xs text-red-500">
              올바른 12자리 핸드폰번호로 입력해주세요.(ex : 010-1234-5678)
            </p>
          )}
        </label>

        {/* 생년월일 (인라인 DatePicker) */}
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-600">생년월일</div>

          <div className="relative">
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

            {isCalOpen && (
              <>
                <div className="fixed inset-0 z-[9998]" onClick={() => setIsCalOpen(false)} />
                <div className="absolute right-0 z-[9999] mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => {
                      if (!date) return;
                      setBirth({
                        y: String(date.getFullYear()),
                        m: String(date.getMonth() + 1).padStart(2, "0"),
                        d: String(date.getDate()).padStart(2, "0"),
                      });
                      setIsCalOpen(false);
                    }}
                    inline
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
        </div>

        {/* 자격증 여부 */}
        <div>
          <div className="mb-2 text-sm font-semibold text-slate-600">자격증 여부 확인</div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setCertOwn(true)}
              className={[
                "flex-1 rounded-full px-6 py-3 text-sm font-bold",
                certOwn === true
                  ? "bg-[#1161FF] text-white shadow-[0_6px_18px_rgba(17,97,255,0.25)]"
                  : "bg-slate-200 text-slate-700",
              ].join(" ")}>
              보유
            </button>
            <button
              type="button"
              onClick={() => setCertOwn(false)}
              className={[
                "flex-1 rounded-full px-6 py-3 text-sm font-bold",
                certOwn === false
                  ? "bg-[#1161FF] text-white shadow-[0_6px_18px_rgba(17,97,255,0.25)]"
                  : "bg-slate-200 text-slate-700",
              ].join(" ")}>
              미보유
            </button>
          </div>
        </div>

        {/* 자격증 업로드 (보유 시) */}
        {certOwn === true && (
          <div className="mt-4">
            <div className="mb-2 text-sm text-slate-400">
              자격증을 AI가 검사 후 인증마크를 달아드립니다
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={certFile?.name || "자격증 업로드"}
                className="flex-1 cursor-default rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-400"
              />
              <label className="inline-block cursor-pointer rounded-2xl bg-[#1161FF] px-4 py-3 text-sm font-bold text-white hover:bg-[#0C2D62]">
                파일 선택
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setCertFile(e.target.files?.[0] ?? null)
                  }
                />
              </label>
            </div>
          </div>
        )}

        {/* 약관 동의 */}
        <label className="mt-2 flex items-center gap-3">
          <input
            type="checkbox"
            checked={agree}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setAgree(e.target.checked)}
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
            disabled={!canSubmit || submitting}
            className={[
              "h-14 rounded-2xl text-base font-extrabold text-white transition",
              !canSubmit || submitting
                ? "cursor-not-allowed bg-[#9BB9FF]"
                : "bg-[#1161FF] hover:bg-[#0C2D62]",
            ].join(" ")}>
            {submitting ? "가입 중..." : "가입"}
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
