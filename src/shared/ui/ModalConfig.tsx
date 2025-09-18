// src/utils/modal-config.ts
import checkBlueIcon from "@assets/icons/icon-check-blue.svg";
import checkRedIcon from "@assets/icons/icon-check-red.svg";
import deleteIcon from "@assets/icons/icon-delete.svg";
import questionIcon from "@assets/icons/icon-question.svg";
import FileInput from "@widgets/common/FileInput";
import SelectBar from "@widgets/common/SelectBar";
import { StarRating } from "@widgets/common/StarRating";
import TitleTextComponent from "@widgets/common/TitleTextComponent";
import type { ReportDetail } from "@/utils/reportUtils";
import { translateReportType } from "@/utils/reportUtils";
import { downloadImage } from "@/utils/downloadUtils";

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
  type?: "alert";
  icon?: string;
  message?: string; // optional (loading 등)
  buttons: ModalButton[];
};

export type FormConfig = {
  type: "form";
  content: (modalData: Record<string, unknown>) => ReactNode;
  buttons: ModalButton[];
};

type ModalConfig = AlertConfig | FormConfig;

export const MODAL_CONFIG = {
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

  confirmReportAgree: {
    icon: questionIcon,
    message: "이 신고를 정말로 승인하시겠습니까?",
    buttons: [
      { text: "승인", variant: "primary", size: "lg", actionType: "confirm" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },

  confirmReportReject: {
    icon: questionIcon,
    message: "이 신고를 정말로 거부하시겠습니까?",
    buttons: [
      { text: "거부", variant: "danger", size: "lg", actionType: "confirm" },
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
      const { onRatingChange } = modalData as { onRatingChange?: (rating: number) => void };
      return (
        <div className="flex flex-col px-4">
          <StarRating onRatingChange={onRatingChange} />
          <textarea
            className="h-24 w-full resize-none rounded-[10px] border-[1px] border-solid border-[#E6E7EA] p-2 outline-none focus:border-[#2F6CFF] focus:shadow-[0_0_0_3px_rgba(47,108,255,0.15)]"
            placeholder="내용을 입력하세요"
          />
        </div>
      );
    },
    buttons: [
      { text: "등록", variant: "primary", size: "lg", actionType: "submit" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },

  reportMentos: {
    type: "form",
    content: (modalData) => (
      <div className="flex flex-col gap-4 px-4">
        {/* 선택한 신고 유형을 modalData.reportType 에 저장 */}
        <SelectBar onChange={(v) => ((modalData as any).reportType = v)} />

        {/* 업로드한 파일을 modalData.imageFile 에 저장 */}
        <FileInput onFileChange={(f) => ((modalData as any).imageFile = f)} />
      </div>
    ),
    buttons: [
      { text: "신고", variant: "danger", size: "lg", actionType: "submit" },
      { text: "취소", variant: "cancelWhite", size: "lg", actionType: "close" },
    ],
  },

  reportDetail: {
    type: "form",
    content: (modalData) => {
      const { detail, loading, error } = modalData as {
        detail: ReportDetail | null;
        loading: boolean;
        error: string | null;
      };

      // 로딩 중일 때
      if (loading) {
        return <div className="p-4 text-center text-gray-500">상세 정보를 불러오는 중...</div>;
      }
      // 에러가 발생했을 때
      if (error) {
        return <div className="p-4 text-center text-red-500">{error}</div>;
      }
      // 데이터가 비어있는 예외 상황 처리
      if (!detail) {
        return <div className="p-4 text-center text-gray-500">표시할 데이터가 없습니다.</div>;
      }

      // 성공 시
      return (
        <div className="flex flex-col gap-4 p-4">
          <TitleTextComponent subtitle="신고자" context={detail.reporterName} />
          <TitleTextComponent subtitle="신고 대상" context={detail.reportedMentosTitle} />
          <TitleTextComponent subtitle="분류" context={translateReportType(detail.reportType)} />

          <div>
            <p className="mb-1 text-sm font-bold text-gray-700">첨부 이미지</p>
            {detail.reportImage ? (
              <div>
                <img
                  src={detail.reportImage}
                  alt="신고 첨부 이미지"
                  className="w-full rounded-lg border border-gray-200 object-contain"
                />
                <button
                  type="button"
                  onClick={() => {
                    // CORS 위반 예방
                    const proxyImageUrl = detail.reportImage.replace(
                      "https://memento.shinhanacademy.co.kr",
                      "/api",
                    );
                    downloadImage(proxyImageUrl);
                  }}
                  className="mt-2 inline-block w-full rounded-md bg-gray-600 px-3 py-1.5 text-center text-xs font-semibold text-white hover:bg-gray-700">
                  이미지 다운로드
                </button>
              </div>
            ) : (
              <p className="text-sm text-gray-500">첨부된 이미지가 없습니다.</p>
            )}
          </div>
        </div>
      );
    },
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
    icon: checkRedIcon,
    message: "탈퇴 요청 처리 중 문제가 발생했습니다.",
    buttons: [{ text: "닫기", variant: "danger", size: "lg", actionType: "close" }],
  },
} as const satisfies Record<string, ModalConfig>;

export type ModalKey = keyof typeof MODAL_CONFIG;
export const isFormConfig = (c: ModalConfig): c is FormConfig => "type" in c && c.type === "form";
