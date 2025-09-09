import React from "react";
import PropTypes from "prop-types";
import MentosCard from "@/components/common/MentosCard";
import MentosMainTitleComponent from "@/components/mentos/MentosMainTitleComponent";
import { useModal } from "@/hooks/common/useModal";
import { CommonModal } from "@/components/common/CommonModal";
import Button from "@/components/common/Button";
import { useNavigate, useLocation } from "react-router-dom";

function MyMentosList({ role, ...props }) {
  const { isOpen, modalType, openModal, closeModal, modalData } = useModal();
  const navigate = useNavigate();
  const location = useLocation();
  const fromPayment = location.state?.fromPaymentSuccess === true;

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
    //  openModal("dismissUser");
    // }
  };

  const onReviewClick = () => {
    openModal("reviewMentos", { title: "인생한방, 공격투자" });
  };

  const onDeleteClick = () => {
    openModal("deleteMentos");
  };

  const onUpdateClick = () => {
    navigate("/edit/1"); //id로 수정필요
  };

  const onReportClick = () => {
    openModal("reportMentos", { title: "신고하기" });
  };

  const onRefundClick = (mentosId) => {
    openModal("refundMentos", { mentosId });
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
              title="React 강의"
              price={50000}
              location="연남동"
              status="mento"
              onUpdateClick={onUpdateClick}
              onDeleteClick={onDeleteClick}
            />
            <MentosCard
              title="React 강의"
              price={50000}
              location="연남동"
              status="mento"
              onUpdateClick={onUpdateClick}
              onDeleteClick={onDeleteClick}
            />
            <MentosCard
              title="React 강의"
              price={50000}
              location="연남동"
              status="mento"
              onUpdateClick={onUpdateClick}
              onDeleteClick={onDeleteClick}
            />
            <MentosCard
              title="React 강의"
              price={50000}
              location="연남동"
              status="mento"
              onUpdateClick={onUpdateClick}
              onDeleteClick={onDeleteClick}
            />
          </section>
          <CommonModal
            type={modalType}
            onConfirm={handleConfirmAction}
            onCancel={handleCancelAction} // 취소 함수 전달
            isOpen={isOpen}
            onSubmit={handleSubmit}
            modalData={modalData} // ⭐️ CommonModal에 modalData 전달
          />
        </section>
      </div>
    );
  }

  return (
    <div className="no-scrollbar flex h-full w-full min-w-[375px] flex-col gap-4 overflow-y-auto bg-white pb-4">
      <section className="px-4 py-5">
        <MentosMainTitleComponent mainTitle="나의 멘토링 내역" />
      </section>
      <section className="flex w-full flex-col items-center justify-center gap-3">
        <MentosCard
          title="React 강의"
          price={50000}
          location="연남동"
          status="completed"
          onReportClick={onReportClick}
          onReviewClick={onReviewClick}
        />
        <MentosCard
          title="React 강의"
          price={50000}
          location="연남동"
          status="completed"
          onReportClick={onReportClick}
          onReviewClick={onReviewClick}
        />
        <MentosCard
          title="React 강의"
          price={50000}
          location="연남동"
          status="pending"
          onRefundClick={() => onRefundClick(101)}
        />
        <MentosCard
          title="React 강의"
          price={50000}
          location="연남동"
          status="pending"
          onRefundClick={() => onRefundClick(102)}
        />
      </section>

      <CommonModal
        type={modalType}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction} // 취소 함수 전달
        isOpen={isOpen}
        onSubmit={handleSubmit}
        modalData={modalData} // ⭐️ CommonModal에 modalData 전달
      />
    </div>
  );
}

MyMentosList.propTypes = { role: PropTypes.oneOf(["mento", "menti"]) };
export default MyMentosList;
