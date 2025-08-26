import React from "react";
import { CommonModal } from "../CommonModal";
import { useModal } from "@/hooks/common/useModal";
import Button from "@/components/common/Button";

function ResultModalTest() {
  const { isOpen, modalType, openModal, closeModal, modalData } = useModal();

  const handleConfirmAction = () => {
    closeModal();
    modalType === "deleteMentos" ? openModal("deleteComplete") : openModal("dismissSuccess");
  };

  const handleCancelAction = () => {
    closeModal();
  };
  const handleSubmit = () => {
    closeModal();
    openModal("reviewComplete");
  };
  return (
    <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-3">
      <Button onClick={() => openModal("deleteMentos")}>멘토 삭제</Button>
      <Button onClick={() => openModal("dismissUser")}>회원 삭제</Button>
      <Button onClick={() => openModal("createMentos")}>멘토스 생성</Button>
      <Button onClick={() => openModal("updateMentos")}>멘토스 수정</Button>
      <Button onClick={() => openModal("reportComplete")}>신고 완료</Button>
      <Button onClick={() => openModal("review", { title: "인생한방, 공격투자" })}>
        리뷰 작성
      </Button>

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

export default ResultModalTest;
