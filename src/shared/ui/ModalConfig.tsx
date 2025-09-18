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
import type { ReportType } from "@entities/mentos/model/types";
import type { ReactNode } from "react";

/* =========================
 * 공용 타입
 * ========================= */
type ModalActionType = "confirm" | "submit" | "close" | "cancel";

export type ModalButton = Omit<ButtonProps, "children" | "onClick"> & {
  text?: string;
  actionType?: ModalActionType;
  to?: string;
};

type AlertConfig = {
  type?: "alert";
  icon?: string;
  message?: string;
  buttons: ModalButton[];
};

export type FormConfig<TData> = {
  type: "form";
  content: (modalData: TData) => ReactNode;
  buttons: ModalButton[];
};

/* =========================
 * 모달별 modalData 타입 정의
 * ========================= */
type BaseData = {
  title?: string;
  description?: string;
};

export type ReviewMentosData = BaseData & {
  mentosSeq?: number;
  initialRating?: number;
  initialContent?: string;
  onRatingChange?: (rating: number) => void;
  onContentChange?: (text: string) => void;
};

export type ReportMentosData = BaseData & {
  reportType?: ReportType;
  imageFile?: File | null;
};

export type ReportDetailData = {
  reporter: string;
  category: string;
  file: string;
};

/* =========================
 * MODAL_CONFIG 레코드 타입
 * ========================= */
type ModalConfigRecord = {
  // 확인/결정
  deleteMentos: AlertConfig;
  dismissUser: AlertConfig;
  refundMentos: AlertConfig;

  // 알림/완료
  createMentos: AlertConfig;
  updateMentos: AlertConfig;
  paySuccess: AlertConfig;
  refundSuccess: AlertConfig;
  reportComplete: AlertConfig;
  reportReject: AlertConfig;
  loading: AlertConfig;
  reviewComplete: AlertConfig;
  refundComplete: AlertConfig;
  deleteComplete: AlertConfig;
  dismissSuccess: AlertConfig;
  reportAgree: AlertConfig;

  // 폼
  reviewMentos: FormConfig<ReviewMentosData>;
  reportMentos: FormConfig<ReportMentosData>;
  reportDetail: FormConfig<ReportDetailData>;

  // 프로필/회원탈퇴
  profileUpdated: AlertConfig;
  withdrawConfirm: AlertConfig;
  withdrawComplete: AlertConfig;
  withdrawFailed: AlertConfig;

  //리뷰
  needReviewContent: AlertConfig;

  //결제
  faildPayment: AlertConfig;
  noPaymentInfo: AlertConfig;
};

/** 키 → 해당 modalData 타입 매핑 (Alert는 BaseData로 통일) */
export type ModalDataMap = {
  [K in keyof ModalConfigRecord]: ModalConfigRecord[K] extends FormConfig<infer T> ? T : BaseData;
};

/* =========================
 * MODAL_CONFIG 구현
 * ========================= */
export const MODAL_CONFIG: ModalConfigRecord = {
  // ---- 확인/결정
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

  // ---- 알림/완료
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
    buttons: [{ text: "확인", variant: "primary", size: "lg", actionType: "close" }],
  },

  refundSuccess: {
    icon: checkBlueIcon,
    message: "환불이 완료되었습니다!",
    buttons: [{ variant: "primary", size: "lg", actionType: "close" }],
  },

  reportComplete: {
    icon: checkRedIcon,
    message: "신고가 접수되었습니다.",
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },

  reportReject: {
    icon: deleteIcon,
    message: "신고를 거절했습니다",
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },

  loading: {
    message: "처리 중입니다...",
    buttons: [],
  },

  reviewComplete: {
    icon: checkBlueIcon,
    message: "리뷰 작성이 완료되었습니다.",
    buttons: [{ text: "닫기", variant: "primary", size: "lg", actionType: "close" }],
  },

  refundComplete: {
    icon: checkBlueIcon,
    message: "환불이 완료되었습니다.",
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

  reportAgree: {
    icon: checkBlueIcon,
    message: "신고를 승인했습니다.",
    buttons: [{ text: "닫기", variant: "primary", size: "lg", actionType: "close" }],
  },

  // ---- 폼
  reviewMentos: {
    type: "form",
    content: (modalData) => {
      const { onRatingChange, onContentChange, initialRating = 0, initialContent = "" } = modalData;

      return (
        <div className="flex flex-col px-4">
          <StarRating initialRating={initialRating} onRatingChange={onRatingChange} />
          <textarea
            className="h-24 w-full resize-none rounded-[10px] border-[1px] border-solid border-[#E6E7EA] p-2 outline-none focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
            placeholder="내용을 입력하세요"
            defaultValue={initialContent}
            onChange={(e) => onContentChange?.(e.target.value)}
          />
        </div>
      );
    },
    buttons: [
      { text: "등록", variant: "primary", size: "lg", actionType: "submit" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "cancel" },
    ],
  },

  reportMentos: {
    type: "form",
    content: (modalData) => (
      <div className="flex flex-col gap-4 px-4">
        <SelectBar
          onChange={(v) => {
            modalData.reportType = v as ReportType;
          }}
        />
        <FileInput
          onFileChange={(f) => {
            modalData.imageFile = f;
          }}
        />
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
        <TitleTextComponent subtitle="신고자" context={modalData.reporter} />
        <TitleTextComponent subtitle="멘토링" context="인생한방" />
        <TitleTextComponent subtitle="신고항목" context={modalData.category} />
        <TitleTextComponent subtitle="파일" context={modalData.file} />
      </div>
    ),
    buttons: [
      { text: "승인", variant: "primary", size: "md", actionType: "submit" },
      { text: "거부", variant: "danger", size: "md", actionType: "confirm" },
      { text: "취소", variant: "cancelWhite", size: "md", actionType: "close" },
    ],
  },

  /* 프로필 수정 완료 */
  profileUpdated: {
    icon: checkBlueIcon,
    message: "수정이 완료되었습니다.",
    buttons: [{ text: "확인", variant: "primary", size: "lg", actionType: "close" }],
  },

  /* 회원 탈퇴 확인 */
  withdrawConfirm: {
    icon: deleteIcon,
    message: "정말 탈퇴하시겠습니까?",
    buttons: [
      { text: "탈퇴", variant: "danger", size: "lg", actionType: "confirm" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },

  /* 회원 탈퇴 완료 */
  withdrawComplete: {
    icon: checkBlueIcon,
    message: "회원 탈퇴가 완료되었습니다.",
    buttons: [{ text: "확인", variant: "primary", size: "lg", actionType: "confirm" }],
  },

  /* (옵션) 회원 탈퇴 실패 */
  withdrawFailed: {
    icon: deleteIcon,
    message: "탈퇴 요청 처리 중 문제가 발생했습니다.",
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },

  needReviewContent: {
    icon: deleteIcon,
    message: undefined,
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },

  faildPayment: {
    icon: deleteIcon,
    message: undefined,
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },

  noPaymentInfo: {
    icon: deleteIcon,
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },
};

/* =========================
 * 내보내기
 * ========================= */
export type ModalKey = keyof ModalConfigRecord;

/** 제네릭 type guard (any/unknown 없이) */
export function isFormConfig<K extends ModalKey>(
  c: ModalConfigRecord[K] | undefined,
): c is Extract<ModalConfigRecord[K], FormConfig<ModalDataMap[K]>> {
  return !!c && typeof c === "object" && "type" in c && (c as { type?: string }).type === "form";
}
