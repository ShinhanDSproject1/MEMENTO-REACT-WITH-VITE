// src/components/mentee/MentosCard.tsx
import Button from "@/widgets/common/Button";
import { Link } from "react-router-dom";

type MentosStatus = "completed" | "pending" | "mento" | "guest";

type MentosCardProps = {
  mentosSeq: number;
  title: string;
  price?: number;
  location?: string;
  status: "pending" | "completed" | "mento";
  imageUrl?: string;
  onReportClick?: () => void;
  onReviewClick?: () => void;
  onRefundClick?: () => void;
  onUpdateClick?: () => void;
  onDeleteClick?: () => void;
  refundDisabled?: boolean;
  reviewDisabled?: boolean; // 리뷰 완료 시 true로 들어옴
};

const statusStyles: Record<MentosStatus, string> = {
  completed: "bg-[#2E3849]",
  pending: "bg-[#B3B6B8]",
  mento: "bg-[#2E3849]",
  guest: "bg-transparent",
};

const statusTextMap: Partial<Record<MentosStatus, string>> = {
  completed: "진행 완료",
  pending: "진행 전",
};

export default function MentosCard({
  mentosSeq,
  onReviewClick,
  onDeleteClick,
  onRefundClick,
  onReportClick,
  onUpdateClick,
  title,
  price,
  location,
  status,
  imageUrl,
  refundDisabled,
  reviewDisabled,
}: MentosCardProps) {
  const statusClassName = statusStyles[status] ?? "";
  const statusText = statusTextMap[status] ?? "";
  const formattedPrice =
    typeof price === "number" && Number.isFinite(price)
      ? price.toLocaleString()
      : String(price ?? "");

  // 액션 버튼 영역
  const actionButton = (() => {
    switch (status) {
      case "completed": {
        // 리뷰 버튼: 완료 시 완전 비활성화 + onClick 제거 + 라벨 변경
        const isDisabled = !!reviewDisabled;
        return (
          <>
            <Button
              className={`text-xs ${isDisabled ? "cursor-not-allowed bg-blue-950 opacity-100 hover:bg-blue-950" : ""}`}
              variant="lightBlue"
              size="sm"
              disabled={isDisabled}
              aria-disabled={isDisabled}
              onClick={isDisabled ? undefined : onReviewClick}
              title={isDisabled ? "이미 리뷰를 작성했습니다" : "리뷰 작성"}>
              {isDisabled ? "리뷰 완료" : "리뷰 작성"}
            </Button>

            <Button className="text-xs" variant="danger" size="sm" onClick={onReportClick}>
              신고하기
            </Button>
          </>
        );
      }

      case "pending": {
        const isDisabled = !!refundDisabled;
        return (
          <Button
            className={`text-xs ${isDisabled ? "cursor-not-allowed opacity-60" : ""}`}
            variant="refund"
            size="sm"
            disabled={isDisabled}
            aria-disabled={isDisabled}
            onClick={isDisabled ? undefined : onRefundClick}
            title={isDisabled ? "환불이 불가한 항목입니다" : "환불하기"}>
            환불하기
          </Button>
        );
      }

      case "mento":
        return (
          <>
            <Button className="text-xs" variant="lightBlue" size="sm" onClick={onUpdateClick}>
              수정하기
            </Button>
            <Button className="text-xs" variant="danger" size="sm" onClick={onDeleteClick}>
              삭제하기
            </Button>
          </>
        );

      default:
        return null;
    }
  })();

  return (
    <div
      className={[
        "group relative flex h-auto w-[80vw] max-w-[360px] flex-col rounded-[10px] border border-solid border-[#E5E7ED] bg-white",
        "transition-all duration-200 ease-out will-change-transform",
        "motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-xl",
        "motion-safe:active:scale-[0.98]",
        "focus-within:ring-2 focus-within:ring-blue-300 focus-within:ring-offset-2 focus-within:ring-offset-white",
      ].join(" ")}>
      <Link
        to={`/menti/mentos-detail/${mentosSeq}`}
        className="rounded-t-[10px] outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-white">
        <section className="h-[15vh] overflow-hidden rounded-t-[10px]">
          <img
            className={[
              "h-full w-full object-cover",
              "transition-transform duration-200 ease-out",
              "motion-safe:group-hover:scale-[1.02]",
            ].join(" ")}
            src={imageUrl || "https://picsum.photos/seed/picsum/200/300"}
            alt="mentos card"
          />
          {statusText && (
            <div
              className={[
                statusClassName,
                "absolute top-2 right-2 rounded-[65px] px-2 py-1 text-xs text-white",
                "transition-transform duration-200 motion-safe:group-hover:-translate-y-0.5",
              ].join(" ")}>
              {statusText}
            </div>
          )}
        </section>
      </Link>

      <section className="item-center flex flex-col gap-1 border-t px-3 py-2">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm">{title}</span>
          <span className="text-sm">₩{formattedPrice}</span>
        </div>
        <div className="flex h-full flex-row items-center justify-between">
          <span className="text-sm">{location}</span>
          <div className="flex flex-row gap-2">{actionButton}</div>
        </div>
      </section>
    </div>
  );
}
