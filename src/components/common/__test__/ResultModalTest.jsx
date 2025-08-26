import React, { useState } from "react";
import PropTypes from "prop-types";
import { CommonModal } from "../CommonModal";
import { useModal } from "@/hooks/common/useModal";
import Button from "@/components/common/Button";

function ResultModalTest() {
  const { isOpen, modalType, openModal, closeModal } = useModal();

  const handleConfirmAction = () => {
    // 여기에 확인 버튼을 눌렀을 때 실행할 로직 (예: API 호출)을 추가합니다.
    closeModal();
    modalType === "deleteMentos" ? openModal("deleteComplete") : openModal("dismissSuccess");
  };

  const handleCancelAction = () => {
    closeModal();
  };
  return (
    <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-3">
      <Button onClick={() => openModal("deleteMentos")}>멘토 삭제</Button>
      <Button onClick={() => openModal("dismissUser")}>회원 삭제</Button>
      <Button onClick={() => openModal("createMentos")}>멘토스 생성</Button>
      <Button onClick={() => openModal("updateMentos")}>멘토스 수정</Button>
      <Button onClick={() => openModal("reportComplete")}>신고 완료</Button>
      <Button onClick={() => openModal("reviewComplete")}>리뷰 완료</Button>
      <CommonModal
        type={modalType}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction} // 취소 함수 전달
        isOpen={isOpen}
      />
    </div>
  );
}

export default ResultModalTest;
