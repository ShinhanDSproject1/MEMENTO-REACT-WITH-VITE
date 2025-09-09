// src/pages/MyProfile.tsx
import DateField from "@/components/profile/BirthDate"; // DateField: selected/onChange 타입 정의되어 있어야 함
import SectionCard from "@/components/profile/CardSection";
import CommonInput from "@/components/profile/CommonInput";
import FieldRow from "@/components/profile/FieldRow";
import PageContainer from "@/components/profile/PageContainer";
import { type ChangeEvent, useState } from "react";

// ── 유틸 함수들 타입 안전하게 정리 ──────────────────────────
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
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(v);
  if (iso) {
    const [y, m, d] = v.split("-");
    return `${y}년 ${m}월 ${d}일`;
  }
  return v;
};

// ── 상태 타입 ─────────────────────────────────────────────
type User = {
  name: string;
  phone: string;
  dob: string; // ISO(YYYY-MM-DD) or "YYYY년 MM월 DD일"
  userid: string;
  pw: string;
};

type ProfileDraft = {
  phone: string;
  dob: string; // ISO string
};

type InfoDraft = {
  current: string;
  next: string;
  confirm: string;
};

export default function MyProfile() {
  const [user, setUser] = useState<User>({
    name: "안가연",
    phone: "010-1111-2222",
    dob: "2001년 01월 25일",
    userid: "memento",
    pw: "12345",
  });

  const [editProfile, setEditProfile] = useState<boolean>(false);
  const [editInfo, setEditInfo] = useState<boolean>(false);

  const [profileDraft, setProfileDraft] = useState<ProfileDraft>({
    phone: user.phone,
    dob: user.dob,
  });

  const [infoDraft, setInfoDraft] = useState<InfoDraft>({
    current: "",
    next: "",
    confirm: "",
  });

  const isCurrentOk =
    infoDraft.current === user.pw && infoDraft.current.length > 0;
  const isNewMatch =
    infoDraft.next.length > 0 && infoDraft.next === infoDraft.confirm;
  const canSubmit = isCurrentOk && isNewMatch;

  const handleProfileSave = () => {
    setUser((prev) => ({
      ...prev,
      phone: profileDraft.phone,
      dob: profileDraft.dob,
    }));
    setEditProfile(false);
  };

  const handleInfoSave = () => {
    setUser((prev) => ({ ...prev, pw: infoDraft.next }));
    setEditInfo(false);
    setInfoDraft({ current: "", next: "", confirm: "" });
  };

  const onChangePhone = (e: ChangeEvent<HTMLInputElement>) => {
    setProfileDraft((d) => ({ ...d, phone: e.target.value }));
  };

  const onChangeCurrent = (e: ChangeEvent<HTMLInputElement>) => {
    setInfoDraft((d) => ({ ...d, current: e.target.value }));
  };
  const onChangeNext = (e: ChangeEvent<HTMLInputElement>) => {
    setInfoDraft((d) => ({ ...d, next: e.target.value }));
  };
  const onChangeConfirm = (e: ChangeEvent<HTMLInputElement>) => {
    setInfoDraft((d) => ({ ...d, confirm: e.target.value }));
  };

  const headingCls =
    "mb-6 text-left text-[24px] leading-[28px] tracking-tight font-bold text-[#121418]";

  return (
    <div className="font-WooridaumB flex min-h-screen justify-center bg-[#f5f6f8] antialiased">
      <main className="min-h-dvh w-full bg-white px-4 py-8 shadow">
        <PageContainer>
          {/* 내 프로필 */}
          <h2 className={headingCls}>내 프로필</h2>
          <section className="mb-8">
            <SectionCard>
              <FieldRow label="이름" htmlFor="name">
                {/* tone prop은 CommonInput 타입에 없을 수 있어 제거 */}
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
                    onChange={(date) =>
                      setProfileDraft((d) => ({ ...d, dob: toISO(date) }))
                    }
                  />
                ) : (
                  <CommonInput
                    id="dob"
                    value={fmtKOR(user.dob)}
                    editable={false}
                  />
                )}
              </FieldRow>

              <div className="flex justify-end">
                {editProfile ? (
                  <button
                    className="cursor-pointer rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005EF9] md:text-base"
                    onClick={handleProfileSave}
                    type="button"
                  >
                    수정 완료
                  </button>
                ) : (
                  <button
                    className="cursor-pointer rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005EF9] md:text-base"
                    onClick={() => setEditProfile(true)}
                    type="button"
                  >
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
                      type="button"
                    >
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
                      // validation prop이 CommonInput에 없으면 제거
                      placeholder={
                        infoDraft.current.length > 0 && !isCurrentOk
                          ? "현재 비밀번호가 일치하지 않습니다"
                          : ""
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
                    <CommonInput
                      id="confirmPw"
                      type="password"
                      value={infoDraft.confirm}
                      onChange={onChangeConfirm}
                      editable
                      placeholder={
                        infoDraft.confirm.length > 0 && !isNewMatch
                          ? "새 비밀번호와 일치하지 않습니다"
                          : ""
                      }
                    />
                  </FieldRow>

                  <div className="mt-1 flex justify-end">
                    <button
                      className={`cursor-pointer rounded-lg px-4 py-2 text-sm font-semibold text-white md:text-base ${
                        canSubmit
                          ? "bg-[#005EF9] hover:bg-[#005EF9]"
                          : "cursor-not-allowed bg-gray-300"
                      }`}
                      disabled={!canSubmit}
                      onClick={handleInfoSave}
                      type="button"
                    >
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
              type="button"
            >
              계정 탈퇴
            </button>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
