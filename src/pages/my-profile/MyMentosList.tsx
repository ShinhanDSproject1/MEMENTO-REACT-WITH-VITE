// src/pages/MyMentosList.tsx
import Button from "@/widgets/common/Button";
import { CommonModal } from "@/widgets/common/CommonModal";
import MentosCard from "@/widgets/common/MentosCard";
import MentosMainTitleComponent from "@/widgets/mentos/MentosMainTitleComponent";
import { useModal } from "@hooks/ui/useModal";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";

type Role = "mento" | "menti";

// 이 페이지에서 사용하는 모달 타입들만 엄격하게 명시
type ModalType =
  | "deleteMentos"
  | "deleteComplete"
  | "dismissUser"
  | "dismissSuccess"
  | "refundMentos"
  | "refundComplete"
  | "reviewMentos"
  | "reviewComplete"
  | "reportMentos"
  | "reportComplete";

// 필요한 최소 모달 훅 반환 타입(프로젝트 훅 시그니처에 맞게 필요 시 확장 가능)
type UseModalReturn = {
  isOpen: boolean;
  modalType?: ModalType;
  modalData?: Record<string, unknown>;
  openModal: (type: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;
};

interface MyMentosListProps {
  role: Role;
}

const MyMentosList: FC<MyMentosListProps> = ({ role }) => {
  const { isOpen, modalType, openModal, closeModal, modalData } = useModal() as UseModalReturn;
  const navigate = useNavigate();

  const handleConfirmAction = () => {
    closeModal();

    if (modalType === "deleteMentos") {
      return openModal("deleteComplete");
    }
    if (modalType === "dismissUser") {
      return openModal("dismissSuccess");
    }
    if (modalType === "refundMentos") {
      return openModal("refundComplete");
    }
  };

  const handleCancelAction = () => {
    closeModal();
  };

  const handleSubmit = () => {
    closeModal();
    if (modalType === "reviewMentos") {
      openModal("reviewComplete");
    }
    if (modalType === "reportMentos") {
      openModal("reportComplete");
    }
    // if (modalType === "reportDetail") {
    //   openModal("dismissUser");
    // }
  };

  const onReviewClick = () => {
    openModal("reviewMentos", { title: "인생한방, 공격투자" });
  };

  const onDeleteClick = () => {
    openModal("deleteMentos");
  };

  const onUpdateClick = () => {
    navigate("/edit/1"); // TODO: 실제 id로 교체
  };

  const onReportClick = () => {
    openModal("reportMentos", { title: "신고하기" });
  };

  const onRefundClick = () => {
    openModal("refundMentos");
  };

  if (role === "mento") {
    return (
      <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] antialiased">
        <section className="w-full overflow-x-hidden bg-white px-4 py-5 shadow">
          <div className="mt-6 mb-15 flex w-full items-baseline justify-between">
            <h1 className="font-WooridaumB pl-2 text-[20px] leading-[30px] font-bold">
              멘토링 관리
            </h1>

            <Button
              variant="primary"
              size="sm"
              className="-mt-[1px] !h-[32px] !rounded-[8px] !px-3 !text-[13px] !leading-[30px] whitespace-nowrap"
              onClick={() => navigate("/create-mentos")}>
              멘토링 생성하기
            </Button>
          </div>

          <section className="flex w-full flex-col items-center justify-center gap-4">
            <MentosCard
              mentosSeq={1}
              title="React 강의"
              price={50000}
              location="연남동"
              status="mento"
              onUpdateClick={onUpdateClick}
              onDeleteClick={onDeleteClick}
            />
            <MentosCard
              mentosSeq={1}
              title="React 강의"
              price={50000}
              location="연남동"
              status="mento"
              onUpdateClick={onUpdateClick}
              onDeleteClick={onDeleteClick}
            />
            <MentosCard
              mentosSeq={1}
              title="React 강의"
              price={50000}
              location="연남동"
              status="mento"
              onUpdateClick={onUpdateClick}
              onDeleteClick={onDeleteClick}
            />
            <MentosCard
              mentosSeq={1}
              title="React 강의"
              price={50000}
              location="연남동"
              status="mento"
              onUpdateClick={onUpdateClick}
              onDeleteClick={onDeleteClick}
            />
          </section>

          <CommonModal
            type={"deleteMentos"}
            onConfirm={handleConfirmAction}
            onCancel={handleCancelAction}
            isOpen={isOpen}
            onSubmit={handleSubmit}
            modalData={modalData}
          />
        </section>
      </div>
    );
  }

  // role === 'menti'
  return (
    <div className="no-scrollbar flex h-full w-full min-w-[375px] flex-col gap-4 overflow-y-auto bg-white pb-4">
      <MentosMainTitleComponent mainTitle={"나의 멘토링 내역"} />
      <section className="flex w-full flex-col items-center justify-center gap-3">
        <MentosCard
          mentosSeq={1}
          title="React 강의"
          price={50000}
          location="연남동"
          status="completed"
          onReportClick={onReportClick}
          onReviewClick={onReviewClick}
        />
        <MentosCard
          mentosSeq={2}
          title="React 강의"
          price={50000}
          location="연남동"
          status="completed"
          onReportClick={onReportClick}
          onReviewClick={onReviewClick}
        />
        <MentosCard
          mentosSeq={3}
          title="React 강의"
          price={50000}
          location="연남동"
          status="pending"
          onRefundClick={onRefundClick}
        />
        <MentosCard
          mentosSeq={4}
          title="React 강의"
          price={50000}
          location="연남동"
          status="pending"
          onRefundClick={onRefundClick}
        />
      </section>

      <CommonModal
        type={"deleteMentos"}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        isOpen={isOpen}
        onSubmit={handleSubmit}
        modalData={modalData}
      />
    </div>
  );
};

export default MyMentosList;
