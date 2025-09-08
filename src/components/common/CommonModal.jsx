import PropTypes from "prop-types";
import { createPortal } from "react-dom";
import { MODAL_CONFIG } from "@/utils/modal-config";
import Button from "./Button";

export function CommonModal({ type, isOpen, onCancel, onConfirm, onSubmit, modalData, ...props }) {
  if (!isOpen) {
    return null;
  }

  const config = MODAL_CONFIG[type];

  if (!config) {
    //나중에 throw error
    return null;
  }

  const modal = (
    <div
      style={{ scrollbarWidth: "none" }}
      className="fixed inset-0 z-[2147483647] flex items-center justify-center bg-black/50">
      <div
        className={`flex w-full max-w-[270px] flex-col ${config.type === "form" ? "gap-3" : "gap-5 p-4"} max-h-[80vh] overflow-y-auto rounded-[10px] bg-white break-words`}>
        {/* ⭐️ 모달 타입에 따라 다른 콘텐츠 렌더링 */}
        {config.type === "form" ? (
          // 폼 모달 (리뷰 작성 등)
          <>
            {/* ⭐️ modalData.title이 있다면 렌더링 */}
            {modalData.title && (
              <span
                className={`${modalData.title === "상세보기" ? "rounded-t-[10px] bg-[#005EF9] px-3 pt-3 pb-3 text-white" : ""} px-4 pt-4 text-center text-[1.2rem] font-bold`}>
                {modalData.title}
              </span>
            )}
            {/* config.content가 함수이므로 modalData를 전달 */}
            {config.content && typeof config.content === "function" && config.content(modalData)}
          </>
        ) : (
          // 알림/결정 모달
          <>
            {config.icon && (
              <div className="flex justify-center">
                <img className="w-[15vw] max-w-[60px]" src={config.icon} alt="모달 아이콘" />
              </div>
            )}
            <div>
              <p className="text-center font-semibold" style={{ color: "#707070" }}>
                {config.message}
              </p>
            </div>
          </>
        )}
        {/* 하단 버튼 영역 */}

        <div className={`flex justify-center gap-4 ${config.type === "form" ? "px-4 pb-4" : ""}`}>
          {config.buttons.map((btn, index) => {
            const onClickHandler =
              btn.actionType === "confirm"
                ? onConfirm
                : btn.actionType === "submit"
                  ? onSubmit
                  : onCancel;
            const buttonCount = config.buttons.length;
            // 버튼이 한 개일 때는 className을 비우고, 여러 개일 때는 'w-full'을 적용
            const buttonClassName = buttonCount > 1 ? "w-full" : "";

            return (
              <Button
                key={index}
                className={buttonClassName} // ✅ 여기에서 클래스를 적용
                {...btn}
                onClick={onClickHandler}>
                {btn.text}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
  return createPortal(modal, document.body);
}

// PropTypes 정의
CommonModal.propTypes = {
  type: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
  onSubmit: PropTypes.func,
  modalData: PropTypes.object,
};
