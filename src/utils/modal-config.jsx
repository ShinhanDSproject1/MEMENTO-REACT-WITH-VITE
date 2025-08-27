import deleteIcon from "@/assets/icons/delete.svg";
import checkBlueIcon from "@/assets/icons/check-blue.svg";
import checkRedIcon from "@/assets/icons/check-red.svg";
import { StarRating } from "@/components/common/StarRating";
import SelectBar from "@/components/common/SelectBar";
import FileInput from "@/components/common/FileInput";

export const MODAL_CONFIG = {
  // '확인/결정' 모달 케이스
  deleteMentos: {
    icon: deleteIcon,
    message: "정말 삭제하시겠습니까?",
    buttons: [
      {
        text: "확인",
        variant: "danger",
        size: "lg",
        actionType: "confirm",
      },
      {
        text: "취소",
        variant: "cancelWhite",
        size: "lg",
        actionType: "close",
      },
    ],
  },
  dismissUser: {
    icon: deleteIcon,
    message: "정말 제명하시겠습니까?",
    buttons: [
      { text: "확인", variant: "danger", size: "lg", actionType: "confirm" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },

  // '알림/완료' 모달 케이스
  createMentos: {
    icon: checkBlueIcon,
    message: "생성이 완료되었습니다!",
    buttons: [{ text: "닫기", variant: "primary", size: "lg", actionType: "close" }],
  },
  updateMentos: {
    icon: checkBlueIcon,
    message: "수정이 완료되었습니다!",
    buttons: [{ text: "닫기", variant: "primary", size: "lg", actionType: "close" }],
  },
  reportComplete: {
    icon: checkBlueIcon,
    message: "신고가 완료되었습니다.",
    buttons: [{ text: "닫기", variant: "primary", size: "lg", actionType: "close" }],
  },
  reviewComplete: {
    icon: checkBlueIcon,
    message: "리뷰 작성이 완료되었습니다.",
    buttons: [{ text: "닫기", variant: "primary", size: "lg", actionType: "close" }],
  },
  deleteComplete: {
    icon: checkRedIcon,
    message: "삭제가 완료되었습니다!",
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },
  dismissSuccess: {
    icon: checkRedIcon,
    message: "제명이 완료되었습니다.",
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },

  // '폼(form)' 모달 케이스
  review: {
    type: "form", // 새로운 type 속성 추가
    content: (modalData) => (
      <div className="flex flex-col">
        <StarRating onRatingChange={modalData.onRatingChange} />
        <textarea
          className="h-24 w-full resize-none rounded-[10px] border-[1px] border-solid border-[#E6E7EA] p-2"
          placeholder="내용을 입력하세요"
        />
      </div>
    ),
    buttons: [
      { text: "등록", variant: "primary", size: "lg", actionType: "submit" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },

  // '폼(form)' 모달 케이스
  report: {
    type: "form", // 새로운 type 속성 추가
    content: (modalData) => (
      <div className="flex flex-col gap-4">
        <SelectBar />
        <FileInput />
      </div>
    ),
    buttons: [
      { text: "등록", variant: "primary", size: "lg", actionType: "submit" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },
};
