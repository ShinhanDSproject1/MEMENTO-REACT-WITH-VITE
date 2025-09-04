import { useState } from "react";
import PageContainer from "@/components/profile/PageContainer";
import SectionCard from "@/components/profile/CardSection";
import FieldRow from "@/components/profile/FieldRow";
import DateField from "@/components/profile/BirthDate";
import CommonInput from "@/components/profile/CommonInput";

const toDate = (v) => {
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
const toISO = (date) => {
  if (!date) return "";
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
const fmtKOR = (v) => {
  if (!v) return "";
  const iso = /^\d{4}-\d{2}-\d{2}$/.test(v);
  if (iso) {
    const [y, m, d] = v.split("-");
    return `${y}년 ${m}월 ${d}일`;
  }
  return v;
};

export default function MyProfile() {
  const [user, setUser] = useState({
    name: "안가연",
    phone: "010-1111-2222",
    dob: "2001년 01월 25일",
    userid: "memento",
    pw: "12345",
  });

  const [editProfile, setEditProfile] = useState(false);
  const [editInfo, setEditInfo] = useState(false);

  const [profileDraft, setProfileDraft] = useState({ phone: user.phone, dob: user.dob });
  const [infoDraft, setInfoDraft] = useState({ current: "", next: "", confirm: "" });

  const isCurrentOk = infoDraft.current === user.pw && infoDraft.current.length > 0;
  const isNewMatch = infoDraft.next.length > 0 && infoDraft.next === infoDraft.confirm;
  const canSubmit = isCurrentOk && isNewMatch;

  const handleProfileSave = () => {
    setUser((prev) => ({ ...prev, phone: profileDraft.phone, dob: profileDraft.dob }));
    setEditProfile(false);
  };
  const handleInfoSave = () => {
    setUser((prev) => ({ ...prev, pw: infoDraft.next }));
    setEditInfo(false);
    setInfoDraft({ current: "", next: "", confirm: "" });
  };

  const headingCls =
    "mb-6 text-left text-[24px] leading-[28px] tracking-tight font-bold text-[#121418]";

  return (
    <div className="font-WooridaumB flex min-h-screen justify-center bg-[#f5f6f8] antialiased">
      <main className="min-h-dvh w-full bg-white px-4 py-8 shadow">
        <PageContainer>
          <h2 className={headingCls}>내 프로필</h2>
          <section className="mb-8">
            <SectionCard>
              <FieldRow label="이름" htmlFor="name">
                <CommonInput id="name" value={user.name} editable={false} tone="light" />
              </FieldRow>

              <FieldRow label="전화번호" htmlFor="phone">
                <CommonInput
                  id="phone"
                  value={editProfile ? profileDraft.phone : user.phone}
                  editable={editProfile}
                  onChange={(e) => setProfileDraft((d) => ({ ...d, phone: e.target.value }))}
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
                    onClick={handleProfileSave}>
                    수정 완료
                  </button>
                ) : (
                  <button
                    className="cursor-pointer rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005EF9] md:text-base"
                    onClick={() => setEditProfile(true)}>
                    프로필 수정
                  </button>
                )}
              </div>
            </SectionCard>
          </section>

          <h2 className={headingCls}>기본정보</h2>
          <section className="mb-8">
            <SectionCard>
              <FieldRow label="아이디" htmlFor="userid">
                <CommonInput id="userid" value={user.userid} editable={false} tone="light" />
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
                      onClick={() => setEditInfo(true)}>
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
                      onChange={(e) => setInfoDraft((d) => ({ ...d, current: e.target.value }))}
                      editable
                      validation={
                        infoDraft.current.length === 0 ? undefined : isCurrentOk ? "ok" : "error"
                      }
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
                      onChange={(e) => setInfoDraft((d) => ({ ...d, next: e.target.value }))}
                      editable
                      placeholder="8자 이상 권장"
                    />
                  </FieldRow>

                  <FieldRow label="비밀번호 확인" htmlFor="confirmPw">
                    <CommonInput
                      id="confirmPw"
                      type="password"
                      value={infoDraft.confirm}
                      onChange={(e) => setInfoDraft((d) => ({ ...d, confirm: e.target.value }))}
                      editable
                      validation={
                        infoDraft.confirm.length === 0 ? undefined : isNewMatch ? "ok" : "error"
                      }
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
                      onClick={handleInfoSave}>
                      변경 완료
                    </button>
                  </div>
                </>
              )}
            </SectionCard>
          </section>

          <div className="mb-12 flex w-full justify-end">
            <button className="w-fit cursor-pointer rounded-lg py-15 text-sm font-semibold text-black underline">
              계정 탈퇴
            </button>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
