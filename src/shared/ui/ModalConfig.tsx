// src/utils/modal-config.ts
import checkBlueIcon from "@assets/icons/icon-check-blue.svg";
import checkRedIcon from "@assets/icons/icon-check-red.svg";
import deleteIcon from "@assets/icons/icon-delete.svg";
import questionIcon from "@assets/icons/icon-question.svg";
import FileInput from "@widgets/common/FileInput";
import SelectBar from "@widgets/common/SelectBar";
import { StarRating } from "@widgets/common/StarRating";
import TitleTextComponent from "@widgets/common/TitleTextComponent";

import type { ButtonProps } from "@/widgets/common/Button";
import type { ReactNode } from "react";

type ModalActionType = "confirm" | "submit" | "close" | "cancel";

export type ModalButton = Omit<ButtonProps, "children" | "onClick"> & {
  text?: string;
  actionType?: ModalActionType;
  to?: string;
};

// 알림/결정 모달
type AlertConfig = {
  type?: "alert"; // 기본값처럼 사용 (생략 가능)
  icon?: string;
  message: string;
  buttons: ModalButton[];
};

export type FormConfig = {
  type: "form";
  content: (modalData: Record<string, unknown>) => ReactNode;
  buttons: ModalButton[];
};
// 전체 모달 설정 타입
type ModalConfig = AlertConfig | FormConfig;

// 🔥 리터럴 타입 유지 + 구조 검증을 동시에
export const MODAL_CONFIG = {
  // '확인/결정' 모달 케이스
  deleteMentos: {
    icon: deleteIcon,
    message: "정말 삭제하시겠습니까?",
    buttons: [
      { text: "확인", variant: "danger", size: "lg", actionType: "confirm" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
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

  refundMentos: {
    icon: questionIcon,
    message: "정말 환불하시겠습니까?",
    buttons: [
      { text: "확인", variant: "primary", size: "lg", actionType: "confirm" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },

  // '알림/완료' 모달 케이스
  createMentos: {
    icon: checkBlueIcon,
    message: "생성이 완료되었습니다!",
    buttons: [
      {
        text: "닫기",
        variant: "primary",
        size: "lg",
        actionType: "close",
        to: "/mentee/consumption",
      },
    ],
  },

  updateMentos: {
    icon: checkBlueIcon,
    message: "수정이 완료되었습니다!",
    buttons: [
      {
        text: "닫기",
        variant: "primary",
        size: "lg",
        actionType: "close",
        to: "/mentee/consumption",
      },
    ],
  },

  paySuccess: {
    icon: checkBlueIcon,
    message: "결제가 완료되었습니다!",
    buttons: [
      {
        text: "나의 멘토스 내역으로 이동",
        variant: "primary",
        size: "lg",
        actionType: "close",
        to: "/mentee/mymentos",
      },
    ],
  },

  refundSuccess: {
    icon: checkBlueIcon,
    message: "환불이 완료되었습니다!",
    buttons: [{ variant: "primary", size: "lg", actionType: "close" }],
  },

  reportComplete: {
    icon: checkRedIcon,
    message: "신고가 접수되었습니다.",
    buttons: [
      { text: "닫기", variant: "danger", size: "lg", actionType: "close" },
    ],
  },

  reportReject: {
    icon: deleteIcon,
    message: "신고를 거절했습니다",
    buttons: [
      { text: "닫기", variant: "danger", size: "lg", actionType: "close" },
    ],
  },

  reviewComplete: {
    icon: checkBlueIcon,
    message: "리뷰 작성이 완료되었습니다.",
    buttons: [
      { text: "닫기", variant: "primary", size: "lg", actionType: "close" },
    ],
  },

  refundComplete: {
    icon: checkBlueIcon,
    message: "환불이 완료되었습니다.",
    buttons: [
      { text: "닫기", variant: "primary", size: "lg", actionType: "close" },
    ],
  },

  deleteComplete: {
    icon: checkRedIcon,
    message: "삭제가 완료되었습니다!",
    buttons: [
      { text: "닫기", variant: "danger", size: "lg", actionType: "close" },
    ],
  },

  dismissSuccess: {
    icon: checkRedIcon,
    message: "제명이 완료되었습니다.",
    buttons: [
      { text: "닫기", variant: "danger", size: "lg", actionType: "close" },
    ],
  },

  reportAgree: {
    icon: checkBlueIcon,
    message: "신고를 승인했습니다.",
    buttons: [
      { text: "닫기", variant: "primary", size: "lg", actionType: "close" },
    ],
  },

  // '폼(form)' 모달 케이스
  reviewMentos: {
    type: "form",
    content: (modalData) => (
      <div className="flex flex-col px-4">
        <StarRating onRatingChange={(modalData as any).onRatingChange} />
        <textarea
          className="h-24 w-full resize-none rounded-[10px] border-[1px] border-solid border-[#E6E7EA] p-2 outline-none focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
          placeholder="내용을 입력하세요"
        />
      </div>
    ),
    buttons: [
      { text: "등록", variant: "primary", size: "lg", actionType: "submit" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },

  reportMentos: {
    type: "form",
    content: () => (
      <div className="flex flex-col gap-4 px-4">
        <SelectBar />
        <FileInput />
      </div>
    ),
    buttons: [
      { text: "신고", variant: "danger", size: "lg", actionType: "submit" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },

  reportDetail: {
    type: "form",
    content: (modalData) => (
      <div className="flex flex-col gap-3 px-4">
        <TitleTextComponent
          subtitle="신고자"
          context={(modalData as any).reporter}
        />
        <TitleTextComponent subtitle="멘토링" context="인생한방" />
        <TitleTextComponent
          subtitle="신고항목"
          context={(modalData as any).category}
        />
        <TitleTextComponent subtitle="파일" context={(modalData as any).file} />
      </div>
    ),
    buttons: [
      { text: "승인", variant: "primary", size: "md", actionType: "submit" },
      { text: "거부", variant: "danger", size: "md", actionType: "confirm" },
      { text: "취소", variant: "cancelWhite", size: "md", actionType: "close" },
    ],
  },
} as const satisfies Record<string, ModalConfig>;

export type ModalKey = keyof typeof MODAL_CONFIG;

// ✅ 타입 가드: 폼인지 확인
export const isFormConfig = (c: ModalConfig): c is FormConfig =>
  "type" in c && c.type === "form";
