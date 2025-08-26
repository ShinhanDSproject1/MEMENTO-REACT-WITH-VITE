import { MODAL_CONFIG } from "@/utils/modal-config";
import PropTypes from "prop-types";
import Button from "./Button";

export function CommonModal({ type, isOpen, onCancel, onConfirm, ...props }) {
  if (!isOpen) {
    return null;
  }
  const config = MODAL_CONFIG[type];

  // 유효하지 않은 type일 경우 렌더링하지 않습니다.
  if (!config) {
    return null;
  }

  // 모달을 body 태그에 직접 렌더링하기 위한 포털을 사용
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex w-full max-w-[250px] flex-col gap-4 rounded-lg bg-white p-4">
        {config.icon && (
          <div className="flex justify-center">
            <img className="w-[15vw]" src={config.icon} alt="모달 아이콘" />
          </div>
        )}
        {config.title && <h3 className="text-center text-lg font-bold">{config.title}</h3>}
        <div className="text-black">
          <p className="text-center">{config.message}</p>
        </div>
        <div className="flex justify-center gap-4">
          {config.buttons.map((btn, index) => {
            const onClickHandler = btn.actionType === "confirm" ? onConfirm : onCancel;
            return (
              <Button key={index} {...btn} onClick={onClickHandler}>
                {btn.text}
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// PropTypes 정의
CommonModal.propTypes = {
  type: PropTypes.string.isRequired,
  onCancel: PropTypes.func,
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func,
};
