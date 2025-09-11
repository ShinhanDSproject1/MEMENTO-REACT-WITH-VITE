// ✅ 훅은 값 임포트
import { useModal } from "@hooks/ui/useModal";
import { CommonModal } from "@widgets/common";
import { useMemo, useState } from "react";

// ---- 타입 정의 ----
type Member = {
  id: number;
  name: string;
  role: string;
  joinedAt: string;
  phone: string;
};

// CommonModal과 MODAL_CONFIG에서 실제 사용하는 키만 유니온으로 정의
type ModalType = "dismissUser" | "dismissSuccess";

type ModalData = {
  member?: Member;
} & Record<string, unknown>;

type UseModalReturn = {
  isOpen: boolean;
  modalType: ModalType | null; // ✅ null 허용
  modalData: ModalData; // ✅ undefined 대신 기본 객체
  openModal: (type: ModalType, data?: ModalData) => void;
  closeModal: () => void;
};

// ---- 목 데이터 ----
const MOCK: Member[] = [
  {
    id: 101,
    name: "안가연",
    role: "멘토",
    joinedAt: "25.99.99",
    phone: "010-2222-3333",
  },
  {
    id: 102,
    name: "안가연",
    role: "멘토",
    joinedAt: "25.99.99",
    phone: "010-2222-3333",
  },
  {
    id: 103,
    name: "안가연",
    role: "멘토",
    joinedAt: "25.99.99",
    phone: "010-2222-3333",
  },
  {
    id: 104,
    name: "안가연",
    role: "멘토",
    joinedAt: "25.99.99",
    phone: "010-2222-3333",
  },
];

export default function MemberReport() {
  const [rows, setRows] = useState<Member[]>(MOCK);

  // ✅ 훅 실제 타입과 맞추기 (훅 제네릭을 지원하지 않는다면 as 캐스트 유지)
  const { isOpen, modalType, openModal, closeModal, modalData } = useModal() as UseModalReturn;

  const [loadingId, setLoadingId] = useState<number | null>(null);

  const selected = useMemo<Member | null>(() => modalData?.member ?? null, [modalData]);

  // 나중에 실제 API 호출로 교체
  const reportMember = async (_memberId: number) => new Promise((r) => setTimeout(r, 400));

  const onClickDismiss = (member: Member) => openModal("dismissUser", { member });

  const handleConfirmAction = async () => {
    if (modalType !== "dismissUser" || !selected) {
      closeModal();
      return;
    }
    try {
      setLoadingId(selected.id);
      await reportMember(selected.id);
      setRows((prev) => prev.filter((r) => r.id !== selected.id));
      closeModal();
      openModal("dismissSuccess");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="font-woori flex min-h-screen w-full items-start justify-center">
      <div className="mx-auto my-6 w-[375px] bg-white text-[#111]">
        <h1 className="mb-3 text-left text-[28px] leading-[32px] font-bold">회원 관리</h1>

        <div className="max-h-[560px] overflow-auto rounded-[12px] border border-[#E5E7ED]">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col style={{ width: "16%" }} />
              <col style={{ width: "14%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "34%" }} />
              <col style={{ width: "18%" }} />
            </colgroup>

            <thead className="sticky top-0 z-10">
              <tr className="bg-[#0b76ff] text-[12px] font-bold text-white">
                <th className="h-10 border-r border-white/35 px-2 text-center first:rounded-tl-[12px]">
                  사용자
                </th>
                <th className="h-10 border-r border-white/35 px-2 text-center">역할</th>
                <th className="h-10 border-r border-white/35 px-2 text-center">가입일</th>
                <th className="h-10 border-r border-white/35 px-2 text-center">전화번호</th>
                <th className="h-10 px-2 text-center last:rounded-tr-[12px]">회원제명</th>
              </tr>
            </thead>

            <tbody className="text-[12px] font-normal [&>tr:last-child>td]:border-b [&>tr>td]:h-10 [&>tr>td]:border-t [&>tr>td]:border-l [&>tr>td]:border-[#E5E7ED] [&>tr>td]:px-2 [&>tr>td]:text-center [&>tr>td]:align-middle [&>tr>td:first-child]:border-l-0 [&>tr>td:nth-child(4)]:whitespace-nowrap">
              {rows.map((r) => (
                <tr key={r.id} className="bg-white">
                  <td>{r.name}</td>
                  <td>{r.role}</td>
                  <td>{r.joinedAt}</td>
                  <td>{r.phone}</td>
                  <td>
                    <div className="flex justify-center">
                      <button
                        className="inline-flex h-6 min-w-[52px] cursor-pointer items-center justify-center rounded-full bg-[#df001f] px-3 text-[12px] leading-none whitespace-nowrap text-white hover:bg-[#b80019] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#df001f]"
                        disabled={loadingId === r.id}
                        onClick={() => onClickDismiss(r)}
                        aria-label={`${r.name} 제명하기`}>
                        {loadingId === r.id ? "처리 중" : "제명"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ✅ modalType이 있을 때만 렌더링해서 타입 에러 방지 */}
      {modalType && (
        <CommonModal
          type={modalType}
          isOpen={isOpen}
          onConfirm={handleConfirmAction}
          onCancel={closeModal}
          onSubmit={closeModal}
          modalData={modalData}
        />
      )}
    </div>
  );
}
