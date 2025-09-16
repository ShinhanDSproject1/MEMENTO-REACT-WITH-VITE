// src/pages/MyProfile.tsx
import DateField from "@/widgets/profile/BirthDate";
import SectionCard from "@/widgets/profile/CardSection";
import CommonInput from "@/widgets/profile/CommonInput";
import FieldRow from "@/widgets/profile/FieldRow";
import PageContainer from "@/widgets/profile/PageContainer";
import { updateMyPassword, useMyProfile, useUpdateMyProfile } from "@entities/profile";
import type { AxiosError } from "axios";
import { type ChangeEvent, useEffect, useState } from "react";

/* ── utils ───────────────────────────────────────────── */
const toDate = (v: string | null | undefined): Date | null => {
  if (!v) return null;
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-").map(Number);
    return new Date(y, m - 1, d);
  }
  const m = v.match(/^(\d{4})년\s*(\d{1,2})월\s*(\d{1,2})일$/);
  if (m) return new Date(+m[1], +m[2] - 1, +m[3]);
  const dt = new Date(v);
  return isNaN(dt.getTime()) ? null : dt;
};
const toISO = (date: Date | null): string => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
const fmtKOR = (v: string | null | undefined): string => {
  if (!v) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
    const [y, m, d] = v.split("-");
    return `${y}년 ${m}월 ${d}일`;
  }
  return v;
};

/* ── local view types ───────────────────────────────── */
type User = {
  name: string;
  phone: string;
  dob: string;
  userid: string;
  pw: string; // 표시용
};
type ProfileDraft = { phone: string; dob: string };
type InfoDraft = { current: string; next: string; confirm: string };

/* ── server → view mapper ───────────────────────────── */
function mapProfileToUser(p: {
  memberName: string;
  memberPhoneNumber: string;
  memberBirthDate: string;
  memberId: string;
}): User {
  return {
    name: p.memberName,
    phone: p.memberPhoneNumber,
    dob: p.memberBirthDate,
    userid: p.memberId,
    pw: "********",
  };
}

export default function MyProfile() {
  const { data: profile, isLoading, isError, refetch } = useMyProfile();
  const { mutateAsync: updateProfile } = useUpdateMyProfile();

  const [user, setUser] = useState<User>({
    name: "",
    phone: "",
    dob: "",
    userid: "",
    pw: "********",
  });

  const [editProfile, setEditProfile] = useState(false);
  const [editInfo, setEditInfo] = useState(false);

  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({ phone: "", dob: "" });
  const [infoDraft, setInfoDraft] = useState<InfoDraft>({ current: "", next: "", confirm: "" });

  // ✅ 수정 완료 모달
  const [isDoneOpen, setDoneOpen] = useState(false);

  // 서버 데이터 들어오면 user/profileDraft 주입
  useEffect(() => {
    if (!profile) return;
    const u = mapProfileToUser(profile);
    setUser(u);
    setProfileDraft({ phone: u.phone, dob: toISO(toDate(u.dob)) });
  }, [profile]);

  // 비번 변경 버튼 활성화: 현재 비번 "입력됨" + 새 비번 일치
  const isCurrentOk = infoDraft.current.length > 0;
  const isNewMatch = infoDraft.next.length > 0 && infoDraft.next === infoDraft.confirm;
  const canSubmit = isCurrentOk && isNewMatch;

  /* ── handlers ─────────────────────────────────────── */
  const handleProfileSave = async () => {
    const input = {
      memberPhoneNumber: profileDraft.phone,
      memberBirthDate: profileDraft.dob,
    };
    try {
      await updateProfile(input);
      setUser((prev) => ({ ...prev, phone: profileDraft.phone, dob: profileDraft.dob }));
      setEditProfile(false);
      setDoneOpen(true); // ✅ 성공 모달
    } catch (e) {
      console.error("[update profile] failed:", e);
      alert("프로필 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleInfoSave = async () => {
    if (!infoDraft.current || !infoDraft.next || !infoDraft.confirm) {
      alert("모든 비밀번호 입력란을 채워주세요.");
      return;
    }
    if (infoDraft.next !== infoDraft.confirm) {
      alert("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await updateMyPassword({
        currentPassword: infoDraft.current,
        newPassword: infoDraft.next,
        confirmPassword: infoDraft.confirm,
      });
      setEditInfo(false);
      setInfoDraft({ current: "", next: "", confirm: "" });
      setUser((prev) => ({ ...prev, pw: "********" }));
      setDoneOpen(true); // ✅ 성공 모달
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      const msg =
        error.response?.data?.message ??
        "비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      alert(msg);
    }
  };

  const onChangePhone = (e: ChangeEvent<HTMLInputElement>) =>
    setProfileDraft((d) => ({ ...d, phone: e.target.value }));
  const onChangeCurrent = (e: ChangeEvent<HTMLInputElement>) =>
    setInfoDraft((d) => ({ ...d, current: e.target.value }));
  const onChangeNext = (e: ChangeEvent<HTMLInputElement>) =>
    setInfoDraft((d) => ({ ...d, next: e.target.value }));
  const onChangeConfirm = (e: ChangeEvent<HTMLInputElement>) =>
    setInfoDraft((d) => ({ ...d, confirm: e.target.value }));

  const headingCls =
    "mb-6 text-left text-[24px] leading-[28px] tracking-tight font-bold text-[#121418]";

  /* ── loading / error ──────────────────────────────── */
  if (isLoading) {
    return (
      <div className="font-WooridaumB flex min-h-screen justify-center bg-[#f5f6f8] antialiased">
        <main className="min-h-dvh w-full bg-white px-4 py-8 shadow">
          <PageContainer>
            <div className="py-10 text-center text-sm text-gray-500">프로필을 불러오는 중…</div>
          </PageContainer>
        </main>
      </div>
    );
  }
  if (isError || !profile) {
    return (
      <div className="font-WooridaumB flex min-h-screen justify-center bg-[#f5f6f8] antialiased">
        <main className="min-h-dvh w-full bg-white px-4 py-8 shadow">
          <PageContainer>
            <div className="py-10 text-center text-sm text-red-500">
              프로필을 불러오지 못했습니다.
              <button
                onClick={() => refetch()}
                className="ml-2 rounded bg-blue-500 px-2 py-1 text-white"
                type="button">
                다시 시도
              </button>
            </div>
          </PageContainer>
        </main>
      </div>
    );
  }

  /* ── view ─────────────────────────────────────────── */
  return (
    <div className="font-WooridaumB flex min-h-screen justify-center bg-[#f5f6f8] antialiased">
      <main className="min-h-dvh w-full bg-white px-4 py-8 shadow">
        <PageContainer>
          {/* 내 프로필 */}
          <h2 className={headingCls}>내 프로필</h2>
          <section className="mb-8">
            <SectionCard>
              <FieldRow label="이름" htmlFor="name">
                <CommonInput id="name" value={user.name} editable={false} />
              </FieldRow>

              <FieldRow label="전화번호" htmlFor="phone">
                <CommonInput
                  id="phone"
                  value={editProfile ? profileDraft.phone : user.phone}
                  editable={editProfile}
                  onChange={onChangePhone}
                  placeholder={editProfile ? "전화번호를 입력하세요" : ""}
                />
              </FieldRow>

              <FieldRow label="생년월일" htmlFor="dob">
                {editProfile ? (
                  <DateField
                    selected={toDate(profileDraft.dob)}
                    onChange={(date) => setProfileDraft((d) => ({ ...d, dob: toISO(date) }))}
                  />
                ) : (
                  <CommonInput id="dob" value={fmtKOR(user.dob)} editable={false} />
                )}
              </FieldRow>

              <div className="flex justify-end">
                {editProfile ? (
                  <button
                    className="cursor-pointer rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005EF9] md:text-base"
                    onClick={handleProfileSave}
                    type="button">
                    수정 완료
                  </button>
                ) : (
                  <button
                    className="cursor-pointer rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005EF9] md:text-base"
                    onClick={() => setEditProfile(true)}
                    type="button">
                    프로필 수정
                  </button>
                )}
              </div>
            </SectionCard>
          </section>

          {/* 기본정보 */}
          <h2 className={headingCls}>기본정보</h2>
          <section className="mb-8">
            <SectionCard>
              <FieldRow label="아이디" htmlFor="userid">
                <CommonInput id="userid" value={user.userid} editable={false} />
              </FieldRow>

              {!editInfo ? (
                <>
                  <FieldRow label="비밀번호" htmlFor="pw">
                    <CommonInput
                      id="pw"
                      type="password"
                      value={"*".repeat(String(user.pw).length || 8)}
                      editable={false}
                    />
                  </FieldRow>
                  <div className="flex justify-end">
                    <button
                      className="cursor-pointer rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005EF9] md:text-base"
                      onClick={() => setEditInfo(true)}
                      type="button">
                      기본정보 변경
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <FieldRow label="현재 비밀번호" htmlFor="currentPw">
                    <CommonInput
                      id="currentPw"
                      type="password"
                      value={infoDraft.current}
                      onChange={onChangeCurrent}
                      editable
                      placeholder={
                        infoDraft.current.length === 0 ? "현재 비밀번호를 입력하세요" : ""
                      }
                    />
                  </FieldRow>

                  <FieldRow label="새 비밀번호" htmlFor="newPw">
                    <CommonInput
                      id="newPw"
                      type="password"
                      value={infoDraft.next}
                      onChange={onChangeNext}
                      editable
                      placeholder="8자 이상 권장"
                    />
                  </FieldRow>

                  <FieldRow label="비밀번호 확인" htmlFor="confirmPw">
                    <div className="w-full">
                      <CommonInput
                        id="confirmPw"
                        type="password"
                        value={infoDraft.confirm}
                        onChange={onChangeConfirm}
                        editable
                        validation={
                          infoDraft.confirm.length === 0
                            ? undefined
                            : infoDraft.next.trim() === infoDraft.confirm.trim()
                              ? "ok"
                              : "error"
                        }
                        placeholder=""
                      />
                      {infoDraft.confirm.length > 0 &&
                        infoDraft.next.trim() !== infoDraft.confirm.trim() && (
                          <p className="mt-1 text-sm text-red-500">비밀번호가 일치하지 않습니다.</p>
                        )}
                    </div>
                  </FieldRow>

                  <div className="mt-1 flex justify-end">
                    <button
                      className={[
                        "cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white md:text-base",
                        canSubmit
                          ? "bg-[#005EF9] hover:bg-[#0C2D62]"
                          : "cursor-not-allowed bg-gray-300",
                      ].join(" ")}
                      disabled={!canSubmit}
                      onClick={handleInfoSave}
                      type="button">
                      변경 완료
                    </button>
                  </div>
                </>
              )}
            </SectionCard>
          </section>

          <div className="mb-12 flex w-full justify-end">
            <button
              className="w-fit cursor-pointer rounded-lg py-15 text-sm font-semibold text-black underline"
              type="button">
              계정 탈퇴
            </button>
          </div>
        </PageContainer>
      </main>

      {/* ✅ 수정 완료 모달 */}
      {isDoneOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDoneOpen(false)} />
          <div className="relative z-10 w-[86%] max-w-sm rounded-2xl bg-white p-5 shadow-xl">
            <div className="mb-3 text-base font-semibold text-[#121418]">수정이 완료되었습니다</div>
            <p className="mb-5 text-sm text-[#606264]">정보가 정상적으로 저장되었습니다.</p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0C2D62]"
                onClick={() => setDoneOpen(false)}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
