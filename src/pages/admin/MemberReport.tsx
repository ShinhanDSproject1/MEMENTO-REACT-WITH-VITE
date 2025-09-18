import { http } from "@/shared/api/https";
import { useModal } from "@hooks/ui/useModal";
import { CommonModal } from "@widgets/common";
import { useEffect, useMemo, useState } from "react";
import { formatDate } from "@/utils/memberTypes";
import type { MemberInfo, MemberApiResponse } from "@/utils/memberTypes";

type ModalType = "dismissUser" | "dismissSuccess" | "loading";

export default function MemberReport() {
  const [members, setMembers] = useState<MemberInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<number | null>(null);

  const { isOpen, modalType, openModal, closeModal, modalData } = useModal<
    ModalType,
    { member?: MemberInfo }
  >();

  const selectedMember = useMemo<MemberInfo | null>(() => modalData?.member ?? null, [modalData]);

  // 컴포넌트가 로드될 때 회원 목록 API 호출
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        const response = await http.get<MemberApiResponse>("/manager/member", {
          params: { limit: 20 }, // 20명씩
        });
        setMembers(response.data.result.members);
      } catch (err) {
        console.error("회원 목록 조회 에러:", err);
        setError("회원 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchMembers();
  }, []);

  // '제명' 버튼 클릭 시 확인 모달
  const onClickDismiss = (member: MemberInfo) => {
    openModal("dismissUser", { member });
  };

  // 모달에서 확인을 눌렀을 때 실행되는 API 호출
  const handleConfirmAction = async () => {
    if (!selectedMember) return;

    setLoadingId(selectedMember.memberSeq);
    try {
      // 제명 API 호출
      await http.patch(`/manager/member/${selectedMember.memberSeq}`);

      // 해당 회원 제거
      setMembers((prev) => prev.filter((m) => m.memberSeq !== selectedMember.memberSeq));

      closeModal();
      openModal("dismissSuccess"); // 성공 알림 모달
    } catch (err) {
      console.error("회원 제명 에러:", err);
      alert("회원 제명 처리에 실패했습니다.");
      closeModal();
    } finally {
      setLoadingId(null);
    }
  };

  if (loading) return <div className="p-10 text-center">로딩 중...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="font-woori flex min-h-screen w-full items-start justify-center">
      <div className="mx-auto my-6 w-[375px] bg-white text-[#111]">
        <h1 className="mb-3 text-left text-[28px] leading-[32px] font-bold">회원 관리</h1>

        <div className="max-h-[560px] overflow-auto rounded-[12px] border border-[#E5E7ED]">
          <table className="w-full table-fixed border-separate border-spacing-0">
            <colgroup>
              <col style={{ width: "25%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "30%" }} />
              <col style={{ width: "25%" }} />
            </colgroup>
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#0b76ff] text-[12px] font-bold text-white">
                <th className="h-10 border-r border-white/35 px-2 text-center first:rounded-tl-[12px]">
                  사용자
                </th>
                <th className="h-10 border-r border-white/35 px-2 text-center">역할</th>
                <th className="h-10 border-r border-white/35 px-2 text-center">가입일</th>
                <th className="h-10 px-2 text-center last:rounded-tr-[12px]">회원제명</th>
              </tr>
            </thead>
            <tbody className="text-[12px] font-normal [&>tr:last-child>td]:border-b [&>tr>td]:h-10 [&>tr>td]:border-t [&>tr>td]:border-l [&>tr>td]:border-[#E5E7ED] [&>tr>td]:px-2 [&>tr>td]:text-center [&>tr>td]:align-middle [&>tr>td:first-child]:border-l-0">
              {members.map((member) => (
                <tr key={member.memberSeq} className="bg-white">
                  <td>{member.memberName}</td>
                  <td>{member.memberType === "MENTO" ? "멘토" : "멘티"}</td>
                  <td>{formatDate(member.createdAt)}</td>
                  <td>
                    <div className="flex justify-center">
                      <button
                        className="inline-flex h-6 min-w-[52px] cursor-pointer items-center justify-center rounded-full bg-[#df001f] px-3 text-[12px] leading-none whitespace-nowrap text-white hover:bg-[#b80019] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-[#df001f]"
                        disabled={loadingId === member.memberSeq}
                        onClick={() => onClickDismiss(member)}
                        aria-label={`${member.memberName} 제명하기`}>
                        {loadingId === member.memberSeq ? "처리 중" : "제명"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalType && (
        <CommonModal
          type={modalType}
          isOpen={isOpen}
          onConfirm={handleConfirmAction}
          onCancel={closeModal}
          modalData={modalData as Record<string, unknown>}
        />
      )}
    </div>
  );
}
