import { useState } from "react";

export type ModalState<TType extends string, TData> = {
  isOpen: boolean;
  modalType: TType | null;
  modalData: TData | undefined;
  openModal: (type: TType, data?: TData) => void;
  closeModal: () => void;
};

export function useModal<
  TType extends string = string,
  TData = Record<string, unknown>,
>(): ModalState<TType, TData> {
  const [isOpen, setIsOpen] = useState(false);
  const [modalType, setModalType] = useState<TType | null>(null);
  const [modalData, setModalData] = useState<TData | undefined>(undefined);

  const openModal = (type: TType, data?: TData) => {
    setModalType(type);
    setModalData(data);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setModalType(null);
    setModalData(undefined);
  };

  return { isOpen, modalType, modalData, openModal, closeModal };
}
