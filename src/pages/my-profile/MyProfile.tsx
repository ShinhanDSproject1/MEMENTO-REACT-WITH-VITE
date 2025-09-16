// src/pages/MyProfile.tsx
import DateField from "@/widgets/profile/BirthDate";
import SectionCard from "@/widgets/profile/CardSection";
import CommonInput from "@/widgets/profile/CommonInput";
import FieldRow from "@/widgets/profile/FieldRow";
import PageContainer from "@/widgets/profile/PageContainer";
import { updateMyPassword, useMyProfile, useUpdateMyProfile } from "@entities/profile";
import type { AxiosError } from "axios";
import { type ChangeEvent, useEffect, useState } from "react";

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
  dob: string;
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

// ✅ 서버 프로필 → 로컬 User 매핑
function mapProfileToUser(p: {
  memberName: string;
  memberPhoneNumber: string;
  memberBirthDate: string; // ISO
  memberId: string;
}): User {
  return {
    name: p.memberName,
    phone: p.memberPhoneNumber,
    dob: p.memberBirthDate, // 내부는 ISO로 들고, 표시에서 fmtKOR 사용
    userid: p.memberId,
    pw: "********", // 서버 비번은 보관하지 않음(표시용)
  };
}

export default function MyProfile() {
  const { data: profile, isLoading, isError, refetch } = useMyProfile();
  const { mutateAsync: updateProfile } = useUpdateMyProfile();

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

  // ✅ 서버 데이터 들어오면 user/profileDraft에 주입 (조회만)
  useEffect(() => {
    if (!profile) return;
    const u = mapProfileToUser(profile);
    setUser(u);
    setProfileDraft({ phone: u.phone, dob: toISO(toDate(u.dob)) });
  }, [profile]);

  const isCurrentOk = infoDraft.current.length > 0;
  const isNewMatch = infoDraft.next.length > 0 && infoDraft.next === infoDraft.confirm;
  const canSubmit = isCurrentOk && isNewMatch;

  const handleProfileSave = async () => {
    // 서버에 보낼 입력 (ISO 보장)
    const input = {
      memberPhoneNumber: profileDraft.phone,
      memberBirthDate: profileDraft.dob, // 이미 toISO로 관리 중
    };

    try {
      await updateProfile(input);
      // ✅ 낙관적 UI: 로컬 상태도 갱신
      setUser((prev) => ({ ...prev, phone: profileDraft.phone, dob: profileDraft.dob }));
      setEditProfile(false);

      // (선택) 즉시 최신 서버 데이터로 동기화하고 싶다면:
      // await qc.invalidateQueries({ queryKey: profileQueryKeys.me() });
    } catch (e) {
      // 간단한 에러 처리
      console.error("[update profile] failed:", e);
      alert("프로필 수정에 실패했습니다. 잠시 후 다시 시도해 주세요.");
    }
  };

  const handleInfoSave = async () => {
    // 클라이언트 쪽 1차 검증
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

      // 성공 처리: UI 초기화
      setEditInfo(false);
      setInfoDraft({ current: "", next: "", confirm: "" });
      // 표시용 pw는 실제 서버 비번을 보관하지 않으니 그대로 두거나 별도 문구로
      setUser((prev) => ({ ...prev, pw: "********" }));
      alert("비밀번호가 변경되었습니다.");
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>;
      const msg =
        error.response?.data?.message ??
        "비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해 주세요.";
      alert(msg);
    }
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

  // ✅ 조회 상태 표시
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
    </div>
  );
}
