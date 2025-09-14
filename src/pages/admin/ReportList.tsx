// src/pages/admin/ReportList.tsx
import { useModal } from "@hooks/ui/useModal";
import { CommonModal } from "@widgets/common";
import { useState } from "react";

// ---- 타입 정의 ----
type ReportRow = {
  id: number;
  name: string;
  role: string;
  category: string;
};

type ModalType = "reportDetail" | "reportAgree" | "reportReject";

interface ModalData {
  title?: string;
  reporter?: string;
  role?: string;
  category?: string;
  file?: string;
  [key: string]: unknown;
}

const MOCK: ReportRow[] = [
  { id: 1, name: "최다희", role: "멘토", category: "금전" },
  { id: 2, name: "김정은", role: "멘티", category: "부적절한 언행" },
  { id: 3, name: "김대현", role: "멘티", category: "잦은 조퇴" },
  { id: 4, name: "김기도", role: "멘티", category: "잦은 지각" },
  { id: 5, name: "조상호", role: "멘티", category: "부적절한 언행" },
];

export default function ReportList() {
  const [rows] = useState<ReportRow[]>(MOCK);

  const { isOpen, modalType, openModal, closeModal, modalData } = useModal<ModalType, ModalData>();

  const handleSubmit = () => {
    if (modalType === "reportDetail") {
      openModal("reportAgree");
    }
  };

  const handleConfirm = () => {
    if (modalType === "reportDetail") {
      openModal("reportReject");
    }
  };

  const onClickDetail = (row: ReportRow) => {
    openModal("reportDetail", {
      title: "상세보기",
      reporter: row.name,
      role: row.role,
      category: row.category,
      file: `${row.name}의 신고.pdf`,
    });
  };

  return (
    <div className="font-woori flex min-h-screen w-full items-start justify-center">
      <div className="mx-auto my-6 w-[375px] bg-white text-[#111]">
        <h1 className="mb-3 text-left text-[28px] leading-[32px] font-bold">신고 확인</h1>

        <div className="overflow-auto rounded-[12px] border border-[#E5E7ED]">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col style={{ width: "28%" }} />
              <col style={{ width: "18%" }} />
              <col style={{ width: "34%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="text-[13px] font-extrabold text-white">
                <th className="h-10 border-r border-white/35 bg-[#0b76ff] px-3 text-center first:rounded-tl-[12px]">
                  신고자
                </th>
                <th className="h-10 border-r border-white/35 bg-[#0b76ff] px-3 text-center">
                  역할
                </th>
                <th className="h-10 border-r border-white/35 bg-[#0b76ff] px-3 text-center">
                  분류
                </th>
                <th className="h-10 bg-[#0b76ff] px-3 text-center last:rounded-tr-[12px]">
                  상세보기
                </th>
              </tr>
            </thead>

            <tbody className="text-[13px] [&>tr:last-child>td]:border-b [&>tr>td]:h-10 [&>tr>td]:border-t [&>tr>td]:border-l [&>tr>td]:border-[#E5E7ED] [&>tr>td]:px-3 [&>tr>td]:text-center [&>tr>td]:align-middle [&>tr>td:first-child]:border-l-0">
              {rows.map((r) => (
                <tr key={r.id} className="bg-white">
                  <td>{r.name}</td>
                  <td>{r.role}</td>
                  <td className="overflow-hidden text-ellipsis whitespace-nowrap">{r.category}</td>
                  <td>
                    <button
                      type="button"
                      className="inline-flex h-6 cursor-pointer items-center justify-center rounded-full bg-[#005EF9] px-3 text-[12px] leading-none whitespace-nowrap text-white hover:bg-[#0048C7] focus:ring-2 focus:ring-[#005EF9]/30 focus:outline-none"
                      onClick={() => onClickDetail(r)}
                      aria-label={`${r.name} 신고 상세보기`}>
                      상세
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isOpen && modalType && (
        <CommonModal
          type={modalType}
          isOpen={isOpen}
          onConfirm={handleConfirm}
          onCancel={closeModal}
          onSubmit={handleSubmit}
          modalData={modalData}
        />
      )}
    </div>
  );
}
