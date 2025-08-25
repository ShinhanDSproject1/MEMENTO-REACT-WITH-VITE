import { useState } from "react";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

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
    userid: "롤체 골드4",
    pw: "12345",
  });

  const [editProfile, setEditProfile] = useState(false);
  const [editInfo, setEditInfo] = useState(false);

  const [profileDraft, setProfileDraft] = useState({
    phone: user.phone,
    dob: user.dob,
  });
  const [infoDraft, setInfoDraft] = useState({
    current: "", // 현재 비밀번호 입력값
    next: "", // 새 비밀번호
    confirm: "", // 새 비밀번호 확인
  });

  // 저장 로직도 next를 적용
  const handleInfoSave = () => {
    setUser((prev) => ({ ...prev, pw: infoDraft.next }));
    setEditInfo(false);
    // 저장 후 입력값 초기화
    setInfoDraft({ current: "", next: "", confirm: "" });
  };

  // 유효성(버튼 활성화용)
  const isCurrentOk = infoDraft.current === user.pw && infoDraft.current.length > 0;
  const isNewMatch = infoDraft.next.length > 0 && infoDraft.next === infoDraft.confirm;
  const canSubmit = isCurrentOk && isNewMatch;

  const handleProfileSave = () => {
    setUser((prev) => ({
      ...prev,
      phone: profileDraft.phone,
      dob: profileDraft.dob,
    }));
    setEditProfile(false);
  };

  return (
    <main className="flex min-h-screen flex-col bg-white pt-16">
      <h1 className="mb-12 text-left text-[25px] font-extrabold tracking-tight text-gray-900">
        내 프로필
      </h1>

      <section className="mb-12 w-full max-w-lg">
        <div className="rounded-2xl border-2 border-gray-300 bg-white p-8 shadow-md">
          <div className="mb-5 flex items-center">
            <label htmlFor="name" className="w-28 text-lg font-semibold text-gray-700">
              이름
            </label>
            <input
              id="name"
              value={user.name}
              readOnly
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-base font-medium text-gray-700"
            />
          </div>

          <div className="mb-5 flex items-center">
            <label htmlFor="phone" className="w-28 text-lg font-semibold text-gray-700">
              전화번호
            </label>
            <input
              id="phone"
              value={editProfile ? profileDraft.phone : user.phone}
              readOnly={!editProfile}
              onChange={(e) => setProfileDraft((d) => ({ ...d, phone: e.target.value }))}
              className={`flex-1 rounded-lg px-4 py-2 text-base font-medium text-gray-700 ${
                editProfile ? "border border-blue-400 bg-white" : "bg-gray-200"
              }`}
            />
          </div>

          <div className="mb-5 flex items-center">
            <label htmlFor="dob" className="w-28 text-lg font-semibold text-gray-700">
              생년월일
            </label>

            {editProfile ? (
              <div className="flex-1">
                <DatePicker
                  id="dob"
                  selected={toDate(profileDraft.dob)}
                  onChange={(date) => setProfileDraft((d) => ({ ...d, dob: toISO(date) }))}
                  dateFormat="yyyy년 MM월 dd일"
                  placeholderText="날짜 선택"
                  locale={ko}
                  showPopperArrow={false}
                  className="h-10 w-full rounded-lg border border-blue-400 px-4 text-base font-medium text-gray-700"
                  showYearDropdown
                  showMonthDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={80}
                />
              </div>
            ) : (
              <input
                id="dob"
                value={fmtKOR(user.dob)}
                readOnly
                className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-base font-medium text-gray-700"
              />
            )}
          </div>

          <div className="flex justify-end">
            {editProfile ? (
              <button
                className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
                onClick={handleProfileSave}>
                수정 완료
              </button>
            ) : (
              <button
                className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
                onClick={() => setEditProfile(true)}>
                프로필 수정
              </button>
            )}
          </div>
        </div>
      </section>

      <h2 className="mb-8 text-2xl font-bold text-gray-900">기본정보</h2>

      <section className="mb-12 w-full max-w-lg">
        <div className="rounded-2xl border-2 border-gray-300 bg-white p-8 shadow-md">
          {/* 아이디 (읽기전용) */}
          <div className="mb-5 flex items-center">
            <label htmlFor="userid" className="w-28 text-lg font-semibold text-gray-700">
              아이디
            </label>
            <input
              id="userid"
              value={user.userid}
              readOnly
              className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-base font-medium text-gray-700"
            />
          </div>

          {/* 편집 전: 기존 비밀번호 1칸만 + 버튼 */}
          {!editInfo ? (
            <>
              <div className="mb-5 flex items-center">
                <label htmlFor="pw" className="w-28 text-lg font-semibold text-gray-700">
                  비밀번호
                </label>
                <input
                  id="pw"
                  type="password"
                  value={"*".repeat(String(user.pw).length || 8)}
                  readOnly
                  className="flex-1 rounded-lg bg-gray-200 px-4 py-2 text-base font-medium text-gray-700"
                />
              </div>
              <div className="flex justify-end">
                <button
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white transition hover:bg-blue-700"
                  onClick={() => setEditInfo(true)}>
                  기본정보 변경
                </button>
              </div>
            </>
          ) : (
            /* 편집 모드: 현재/새/확인 3칸 + 검증 메시지 + 완료 버튼 */
            <>
              {/* 현재 비밀번호 */}
              <div className="mb-3 flex items-center">
                <label htmlFor="currentPw" className="w-28 text-lg font-semibold text-gray-700">
                  현재 비밀번호
                </label>
                <div className="flex-1">
                  <input
                    id="currentPw"
                    type="password"
                    value={infoDraft.current}
                    onChange={(e) => setInfoDraft((d) => ({ ...d, current: e.target.value }))}
                    className={`w-full rounded-lg border px-4 py-2 text-base font-medium text-gray-700 ${infoDraft.current.length === 0 ? "border-blue-400" : isCurrentOk ? "border-green-500" : "border-red-500"}`}
                  />
                  {/* 안내/오류 문구 */}
                  {infoDraft.current.length > 0 && !isCurrentOk && (
                    <p className="mt-1 text-sm text-gray-400">현재 비밀번호가 일치하지 않습니다</p>
                  )}
                </div>
              </div>

              {/* 새 비밀번호 */}
              <div className="mb-3 flex items-center">
                <label htmlFor="newPw" className="w-28 text-lg font-semibold text-gray-700">
                  새 비밀번호
                </label>
                <div className="flex-1">
                  <input
                    id="newPw"
                    type="password"
                    value={infoDraft.next}
                    onChange={(e) => setInfoDraft((d) => ({ ...d, next: e.target.value }))}
                    className="w-full rounded-lg border border-blue-500 px-4 py-2 text-base font-medium text-gray-700 focus:ring-2 focus:ring-blue-300 focus:outline-none"
                  />
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div className="mb-4 flex items-center">
                <label htmlFor="confirmPw" className="w-28 text-lg font-semibold text-gray-700">
                  비밀번호 확인
                </label>
                <div className="flex-1">
                  <input
                    id="confirmPw"
                    type="password"
                    value={infoDraft.confirm}
                    onChange={(e) => setInfoDraft((d) => ({ ...d, confirm: e.target.value }))}
                    className={`w-full rounded-lg border px-4 py-2 text-base font-medium text-gray-700 ${infoDraft.confirm.length === 0 ? "border-blue-400" : isNewMatch ? "border-green-500" : "border-red-500"}`}
                  />
                  {infoDraft.confirm.length > 0 && !isNewMatch && (
                    <p className="mt-1 text-sm text-gray-400">새 비밀번호와 일치하지 않습니다</p>
                  )}
                </div>
              </div>

              {/* 버튼 영역 */}
              <div className="mt-2 flex justify-end gap-2">
                <button
                  className="rounded-lg px-5 py-2 font-semibold text-gray-700 transition hover:bg-gray-100"
                  onClick={() => {
                    setEditInfo(false);
                    setInfoDraft({ current: "", next: "", confirm: "" });
                  }}
                  type="button">
                  취소
                </button>
                <button
                  className={`rounded-lg px-5 py-2 font-semibold text-white transition ${canSubmit ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-blue-300"}`}
                  disabled={!canSubmit}
                  onClick={handleInfoSave}>
                  변경 완료
                </button>
              </div>
            </>
          )}
        </div>
      </section>

      <div className="flex w-full max-w-lg justify-end">
        <button className="rounded-lg bg-red-600 px-6 py-2 font-semibold text-white transition hover:bg-red-700">
          계정 탈퇴
        </button>
      </div>
    </main>
  );
}
