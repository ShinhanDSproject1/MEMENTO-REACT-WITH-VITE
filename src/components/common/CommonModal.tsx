import {
  MODAL_CONFIG,
  isFormConfig,
  type ModalKey,
} from "@/utils/modal-config";
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

export function CommonModal({
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
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/50"
    >
      <div
        className={`flex w-full max-w-[270px] flex-col ${
          isFormConfig(config) ? "gap-3" : "gap-5 p-4"
        } max-h-[80vh] overflow-y-auto rounded-[10px] bg-white break-words`}
      >
        {/* 본문 */}
        {isFormConfig(config) ? (
          <>
            {modalData?.title && (
              <span
                className={`${
                  modalData.title === "상세보기"
                    ? "rounded-t-[10px] bg-[#005EF9] px-3 pt-3 pb-3 text-white"
                    : ""
                } px-4 pt-4 text-center text-[1.2rem] font-bold`}
              >
                {modalData.title}
              </span>
            )}
            {config.content?.(modalData)}
          </>
        ) : (
          <>
            {config.icon && (
              <div className="flex justify-center">
                <img
                  className="w-[15vw] max-w-[60px]"
                  src={config.icon}
                  alt="모달 아이콘"
                />
              </div>
            )}
            <div>
              <p
                className="text-center font-semibold"
                style={{ color: "#707070" }}
              >
                {config.message}
              </p>
            </div>
          </>
        )}

        {/* 하단 버튼 */}
        <div
          className={`flex justify-center gap-4 ${isFormConfig(config) ? "px-4 pb-4" : ""}`}
        >
          {config.buttons.map((btn, index) => {
            const onClickHandler =
              btn.actionType === "confirm"
                ? onConfirm
                : btn.actionType === "submit"
                  ? onSubmit
                  : onCancel;

            const buttonCount = config.buttons.length;
            const buttonClassName = buttonCount > 1 ? "w-full" : "";

            // Button이 모르는 필드는 제외하고 전달
            const { text, actionType, to, ...buttonRest } = btn;

            // readonly 이슈가 있으면 한 번 펼쳐서 복사
            const safeProps = { ...buttonRest } as Omit<
              ButtonProps,
              "children" | "onClick"
            >;

            return (
              <Button
                key={index}
                className={buttonClassName}
                {...safeProps}
                onClick={onClickHandler}
              >
                {text}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
