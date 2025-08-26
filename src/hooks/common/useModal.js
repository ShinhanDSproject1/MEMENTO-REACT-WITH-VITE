import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 모달 타입을 저장할 상태 추가

  const openModal = (type) => {
    // type 인자를 받도록 수정
    setModalType(type);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null); // 모달 닫을 때 타입 초기화
  };

  return {
    isOpen,
    modalType, // modalType을 반환
    openModal,
    closeModal,
  };
};
