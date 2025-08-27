import { useState } from "react";

export const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState(null); // 모달 타입을 저장할 상태 추가
  const [modalData, setModalData] = useState({}); // 동적 데이터를 저장할 상태 추가

  const openModal = (type, data = {}) => {
    // data 인자를 받도록 수정
    setModalType(type);
    setModalData(data); // data 상태 업데이트
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null); // 모달 닫을 때 타입 초기화
    setModalData({}); // 상태 초기화
  };

  return {
    isOpen,
    modalType, // modalType을 반환
    modalData, // modalData를 반환
    openModal,
    closeModal,
  };
};
