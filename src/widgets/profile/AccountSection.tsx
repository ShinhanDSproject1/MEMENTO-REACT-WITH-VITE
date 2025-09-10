import { updatePassword, UpdatePasswordError } from "@entities/user";
import { useState, type ChangeEvent } from "react";
import SectionCard from "./CardSection";
import CommonInput from "./CommonInput";
import FieldRow from "./FieldRow";

// 서비스 에러 형태(추정) — 상황에 맞게 조정 가능

// props 타입
export interface AccountSectionProps {
  user: {
    userid: string;
  };
}

type DraftState = {
  current: string;
  next: string;
  confirm: string;
};

export default function AccountSection({ user }: AccountSectionProps) {
  const headingCls =
    "mb-6 text-left text-[24px] leading-[28px] tracking-tight font-bold text-[#121418]";

  const [edit, setEdit] = useState(false);
  const [draft, setDraft] = useState<DraftState>({
    current: "",
    next: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [currentError, setCurrentError] = useState(false);
  const [serverError, setServerError] = useState("");

  const isNewMatch = draft.next.length > 0 && draft.next === draft.confirm;
  const isNewStrongEnough = draft.next.length >= 8;
  const canSubmit = isNewMatch && isNewStrongEnough && !loading;

  const onChangeCurrent = (e: ChangeEvent<HTMLInputElement>) => {
    setCurrentError(false);
    setDraft((d) => ({ ...d, current: e.target.value }));
  };

  const onSubmit = async () => {
    if (!canSubmit) return;
    setLoading(true);
    setServerError("");
    setCurrentError(false);
    try {
      await updatePassword({
        currentPassword: draft.current,
        newPassword: draft.next,
      });
      setEdit(false);
      setDraft({ current: "", next: "", confirm: "" });
    } catch (error) {
      const err = error as UpdatePasswordError;
      if (err.code === "CURRENT_PASSWORD_INCORRECT") setCurrentError(true);
      else
        setServerError(
          err.message || "변경에 실패했습니다. 다시 시도해 주세요."
        );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className={headingCls}>기본정보</h2>
      <section className="mb-8">
        <SectionCard>
          <FieldRow label="아이디" htmlFor="userid">
            <CommonInput id="userid" value={user.userid} editable={false} />
          </FieldRow>

          {!edit ? (
            <>
              <FieldRow label="비밀번호" htmlFor="pw">
                <CommonInput
                  id="pw"
                  type="password"
                  value={"********"}
                  editable={false}
                />
              </FieldRow>
              <div className="flex justify-end">
                <button
                  className="rounded-lg bg-[#005EF9] px-4 py-2 text-sm font-semibold text-white hover:bg-[#005EF9] md:text-base"
                  onClick={() => setEdit(true)}
                >
                  기본정보 변경
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 현재 비밀번호: 서버에서 틀렸다고 알려줄 때만 에러 */}
              <FieldRow label="현재 비밀번호" htmlFor="currentPw">
                <div className="relative min-w-0 flex-1">
                  <CommonInput
                    id="currentPw"
                    type="password"
                    value={draft.current}
                    onChange={onChangeCurrent}
                    editable
                    validation={currentError ? "error" : undefined}
                    className="pr-44 md:pr-52"
                  />
                  {currentError && (
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs whitespace-nowrap text-gray-400">
                      현재 비밀번호가 일치하지 않습니다
                    </span>
                  )}
                </div>
              </FieldRow>

              <FieldRow label="새 비밀번호" htmlFor="newPw">
                <CommonInput
                  id="newPw"
                  type="password"
                  value={draft.next}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setDraft((d) => ({ ...d, next: e.target.value }))
                  }
                  editable
                  placeholder="8자 이상"
                />
              </FieldRow>

              {/* 확인: 클라 즉시 검증 */}
              <FieldRow label="비밀번호 확인" htmlFor="confirmPw">
                <div className="relative min-w-0 flex-1">
                  <CommonInput
                    id="confirmPw"
                    type="password"
                    value={draft.confirm}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setDraft((d) => ({ ...d, confirm: e.target.value }))
                    }
                    editable
                    validation={
                      draft.confirm.length === 0
                        ? undefined
                        : isNewMatch
                          ? "ok"
                          : "error"
                    }
                    className="pr-44 md:pr-52"
                  />
                  {draft.confirm.length > 0 && !isNewMatch && (
                    <span className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-xs whitespace-nowrap text-gray-400">
                      새 비밀번호와 일치하지 않습니다
                    </span>
                  )}
                </div>
              </FieldRow>

              {serverError && (
                <p className="mt-2 text-right text-xs text-red-500">
                  {serverError}
                </p>
              )}

              <div className="mt-1 flex justify-end">
                <button
                  className={`rounded-lg px-4 py-2 text-sm font-semibold text-white md:text-base ${
                    canSubmit
                      ? "bg-[#005EF9]"
                      : "cursor-not-allowed bg-gray-300"
                  }`}
                  disabled={!canSubmit}
                  onClick={onSubmit}
                >
                  {loading ? "저장 중..." : "변경 완료"}
                </button>
              </div>
            </>
          )}
        </SectionCard>
      </section>
    </>
  );
}
