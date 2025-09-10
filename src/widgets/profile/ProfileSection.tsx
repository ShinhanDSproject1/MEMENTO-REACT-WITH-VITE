// src/components/common/ProfileSection.tsx
import { fmtKOR, toDate, toISO } from "@/utils/date";
import { useState } from "react";
import DateField from "./BirthDate";
import SectionCard from "./CardSection";
import CommonInput from "./CommonInput";
import FieldRow from "./FieldRow";

interface UserProfile {
  name: string;
  phone: string;
  dob: string; // ISO 문자열
}

interface ProfileSectionProps {
  user: UserProfile;
  onSave: (data: { phone: string; dob: string }) => void;
}

export default function ProfileSection({ user, onSave }: ProfileSectionProps) {
  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState({ phone: user.phone, dob: user.dob });

  const headingCls =
    "mb-6 text-left text-[24px] leading-[28px] tracking-tight font-bold text-[#121418]";

  const save = () => {
    onSave({ phone: draft.phone, dob: draft.dob });
    setEdit(false);
  };

  return (
    <>
      <h2 className={headingCls}>내 프로필</h2>
      <section className="mb-8">
        <SectionCard>
          <FieldRow label="이름" htmlFor="name">
            <CommonInput id="name" value={user.name} editable={false} />
          </FieldRow>

          <FieldRow label="전화번호" htmlFor="phone">
            <CommonInput
              id="phone"
              value={edit ? draft.phone : user.phone}
              editable={edit}
              onChange={(e) => setDraft((d) => ({ ...d, phone: e.target.value }))}
              placeholder={edit ? "전화번호를 입력하세요" : ""}
            />
          </FieldRow>

          <FieldRow label="생년월일" htmlFor="dob">
            {edit ? (
              <DateField
                selected={toDate(draft.dob)}
                onChange={(date) => setDraft((d) => ({ ...d, dob: date ? toISO(date) : "" }))}
              />
            ) : (
              <CommonInput id="dob" value={fmtKOR(user.dob)} editable={false} />
            )}
          </FieldRow>

          <div className="flex justify-end">
            {edit ? (
              <button
                onClick={save}
                className="rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0046c7] md:text-base">
                저장
              </button>
            ) : (
              <button
                className="rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0046c7] md:text-base"
                onClick={() => setEdit(true)}>
                프로필 수정
              </button>
            )}
          </div>
        </SectionCard>
      </section>
    </>
  );
}
