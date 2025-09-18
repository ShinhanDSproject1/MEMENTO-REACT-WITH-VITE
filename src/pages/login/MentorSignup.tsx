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

import { loadMentorOnboardingDraft } from "@/shared/lib/mentorProfileStorage";

// 숨김 input (DatePicker 등에서 사용 가능)
const HiddenInput = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  (props, ref: ForwardedRef<HTMLInputElement>) => (
    <input ref={ref} {...props} className="sr-only" readOnly aria-hidden="true" tabIndex={-1} />
  ),
);

type Birth = { y: string; m: string; d: string };

// 한글 요일 → ISO
const KOR_TO_ISO_DAY: Record<string, string> = {
  일: "SUN",
  월: "MON",
  화: "TUE",
  수: "WED",
  목: "THU",
  금: "FRI",
  토: "SAT",
};

// 9 → "09:00"
const toHHMM = (h: number) => String(h).padStart(2, "0") + ":00";

// dataURL → File
async function dataUrlToFile(dataUrl: string, filename = "profile.png"): Promise<File> {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  const match = /^data:(.*?);base64,/.exec(dataUrl);
  const type = match?.[1] || blob.type || "image/png";
  return new File([blob], filename, { type });
}

export default function MentorSignup() {
  const navigate = useNavigate();

  // ===== 가입 폼 상태 =====
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [birth, setBirth] = useState<Birth>({ y: "", m: "", d: "" });

  const [certOwn, setCertOwn] = useState(false);
  const [certFile, setCertFile] = useState<File | null>(null);
  const [certName, setCertName] = useState(""); // 🔹 새 API: certificationName 전송용

  const [agree, setAgree] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const pwOk = pw.length >= 6 && pw === pw2;
  const phoneOk = /^010-\d{4}-\d{4}$/.test(phone);
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
    const certOk = !certOwn || (certOwn && !!certFile && certName.trim() !== "");
    return id.trim() !== "" && pwOk && name.trim() !== "" && phoneOk && birthOk && certOk && agree;
  }, [id, pwOk, name, phoneOk, birthOk, certOwn, certFile, certName, agree]);

  // ===== 온보딩(소개) 페이지에서 저장한 임시값 불러오기 =====
  const draft = loadMentorOnboardingDraft(); // { profileImageDataUrl, profileContent, days, start, end, zonecode, address, detail, bname }

  // ===== 전송 함수 (새 API 스펙) =====
  const submitSignup = async () => {
    const BASE = import.meta.env.VITE_API_BASE_URL ?? "/api";

    // 1) 온보딩 값 정리
    const daysFromDraft: string[] = Array.isArray(draft?.days) ? draft!.days : [];
    // "월,화" → "MON,TUE" (draft가 이미 ISO면 그대로 유지)
    const availableDays =
      daysFromDraft.length > 0
        ? daysFromDraft
            .map((d: string) => (KOR_TO_ISO_DAY[d] ? KOR_TO_ISO_DAY[d] : d.toUpperCase()))
            .join(",")
        : "";

    const startTime = Number.isFinite(draft?.start) ? toHHMM(Number(draft!.start)) : "10:00";
    const endTime = Number.isFinite(draft?.end) ? toHHMM(Number(draft!.end)) : "20:00";

    const mentoPostcode = draft?.zonecode ?? "";
    const mentoRoadAddress = draft?.address ?? "";
    const mentoBname = draft?.bname ?? "";
    const mentoDetail = draft?.detail ?? "";
    const mentoProfileContent = draft?.profileContent ?? "";

    // 2) 멘토 프로필 이미지 파일 준비(선택)
    // - 온보딩에서 dataURL을 저장했다면 파일로 변환하여 mentoImage에 첨부
    // - 이미지 없어도 null 가능(요구사항)
    let mentoImageFile: File | null = null;
    if (draft?.profileImageDataUrl && draft.profileImageDataUrl.startsWith("data:")) {
      try {
        mentoImageFile = await dataUrlToFile(draft.profileImageDataUrl, "mento-profile.png");
      } catch {
        mentoImageFile = null;
      }
    }

    // 3) 가입 폼 값 + 온보딩 값 → multipart/form-data
    const form = new FormData();

    // --- 회원 기본 정보 ---
    form.append("memberId", id.trim());
    form.append("memberPwd", pw);
    form.append("memberName", name.trim());
    form.append("memberPhoneNumber", phone);
    form.append(
      "memberBirthDate",
      `${birth.y}-${birth.m.padStart(2, "0")}-${birth.d.padStart(2, "0")}`,
    );

    // --- 자격증 (파일 자체는 전송 X, 파일명/이름만 보냄 규격) ---
    // certificationImgUrl: 파일명(혹은 URL), certificationName: 자격증명
    if (certOwn && certFile) {
      form.append("certificationImgUrl", certFile.name);
      form.append("certificationName", certName.trim());
    } else {
      form.append("certificationImgUrl", "");
      form.append("certificationName", "");
    }

    // --- 멘토 프로필 정보(온보딩) ---
    form.append("mentoProfileContent", mentoProfileContent);
    form.append("startTime", startTime);
    form.append("endTime", endTime);
    form.append("availableDays", availableDays); // "TUE,THU,SAT" 등
    form.append("mentoPostcode", mentoPostcode);
    form.append("mentoRoadAddress", mentoRoadAddress);
    form.append("mentoBname", mentoBname);
    form.append("mentoDetail", mentoDetail);

    // --- 멘토 이미지(선택) ---
    if (mentoImageFile) {
      form.append("mentoImage", mentoImageFile);
    } else {
      // 백엔드가 null 허용이면 생략해도 되지만 명시하고 싶으면 빈 블랍 전송 X → 그냥 append 안 하는게 일반적
    }

    const res = await fetch(`${BASE}/auth/signup/mento`, {
      method: "POST",
      body: form,
      credentials: "include",
      headers: {
        "Idem-Key": "mento-signup-" + Date.now(), // 멱등키 예시
      },
    });

    const payload = await res.json().catch(() => ({}));
    if (!res.ok || payload?.code !== 1000) {
      const msg = payload?.message || `가입 실패 (${res.status})`;
      const err: any = new Error(msg);
      err.status = res.status;
      throw err;
    }
    return payload;
  };

  // 제출
  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;
    setErrorMsg("");
    setSubmitting(true);

    try {
      await submitSignup(); // 성공 시 {code:1000,status:200,message:"..."}
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
            placeholder="PW 입력(6자 이상)"
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
                onClick={() => {
                  const now = new Date();
                  if (!birth.y) {
                    setBirth({
                      y: String(now.getFullYear()),
                      m: String(now.getMonth() + 1).padStart(2, "0"),
                      d: String(now.getDate()).padStart(2, "0"),
                    });
                  }
                }}
                className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-[#1161FF] shadow-sm hover:bg-slate-50">
                📅 선택
              </button>
            </div>

            <div className="mt-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <DatePicker
                selected={
                  birth.y && birth.m && birth.d
                    ? new Date(Number(birth.y), Number(birth.m) - 1, Number(birth.d))
                    : null
                }
                onChange={(date: Date | null) => {
                  if (!date) return;
                  setBirth({
                    y: String(date.getFullYear()),
                    m: String(date.getMonth() + 1).padStart(2, "0"),
                    d: String(date.getDate()).padStart(2, "0"),
                  });
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
                certOwn
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
                !certOwn
                  ? "bg-[#1161FF] text-white shadow-[0_6px_18px_rgba(17,97,255,0.25)]"
                  : "bg-slate-200 text-slate-700",
              ].join(" ")}>
              미보유
            </button>
          </div>
        </div>

        {/* 자격증 업로드/이름 입력 (보유 시) */}
        {certOwn && (
          <div className="mt-4 space-y-2">
            <div className="text-xs text-slate-500">
              * 새 API: 파일 자체는 올리지 않고, 파일명과 자격증명만 전송합니다.
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={certFile?.name || "자격증 파일 선택"}
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
            <input
              type="text"
              placeholder="자격증 이름 (예: 금융자격증)"
              value={certName}
              onChange={(e) => setCertName(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
            />
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
          <span className="text-sm">이용약관 및 개인정보처리방침에 동의합니다</span>
        </label>

        {/* 오류 메시지 */}
        {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}

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
