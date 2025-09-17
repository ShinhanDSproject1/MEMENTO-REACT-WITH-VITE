import { MODAL_CONFIG, isFormConfig, type ModalKey } from "@ui/ModalConfig";
import { createPortal } from "react-dom";
import Button, { type ButtonProps } from "./Button";

interface CommonModalProps {
  type: ModalKey; // ✅ string → ModalKey
  isOpen: boolean;
  onCancel?: () => void;
  onConfirm?: () => void;
  onSubmit?: () => void;
  modalData?: Record<string, any>;
}

export default function CommonModal({
  type,
  isOpen,
  onCancel,
  onConfirm,
  onSubmit,
  modalData = {},
}: CommonModalProps) {
  if (!isOpen) return null;

  type ModalConfig = (typeof MODAL_CONFIG)[ModalKey];
  const config: ModalConfig = MODAL_CONFIG[type];

  const modal = (
    <div
      style={{ scrollbarWidth: "none" }}
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/50">
      <div className="flex w-full max-w-[270px] flex-col items-center gap-5 rounded-[10px] bg-white p-4">
        {type === "loading" ? (
          <>
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            <p className="mt-3 text-sm text-gray-700">
              {modalData?.description ?? "처리 중입니다..."}
            </p>
          </>
        ) : (
          // 기존 로직 유지
          <>
            {isFormConfig(config) ? (
              <>
                {modalData?.title && (
                  <span className="px-4 pt-4 text-center text-[1.2rem] font-bold">
                    {modalData.title}
                  </span>
                )}
                {config.content?.(modalData)}
              </>
            ) : (
              <>
                {config.icon && (
                  <div className="flex justify-center">
                    <img className="w-[15vw] max-w-[60px]" src={config.icon} alt="모달 아이콘" />
                  </div>
                )}
                <div>
                  <p className="text-center font-semibold text-[#707070]">{config.message}</p>
                </div>
              </>
            )}
            {/* 버튼 영역 */}
            <div className={`flex justify-center gap-4 ${isFormConfig(config) ? "px-4 pb-4" : ""}`}>
              {config.buttons.map((btn, index) => {
                const onClickHandler =
                  btn.actionType === "confirm"
                    ? onConfirm
                    : btn.actionType === "submit"
                      ? onSubmit
                      : onCancel;

                const { text, actionType, to, ...buttonRest } = btn;
                const safeProps = { ...buttonRest } as Omit<ButtonProps, "children" | "onClick">;

                return (
                  <Button key={index} {...safeProps} onClick={onClickHandler}>
                    {text}
                  </Button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
