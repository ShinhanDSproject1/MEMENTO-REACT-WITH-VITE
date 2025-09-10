// src/components/mentee/MentosCard.tsx
import Button from "@/widgets/common/Button";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";

type MentosStatus = "completed" | "pending" | "mento";

export interface MentosCardProps {
  mentosSeq: number;
  title: string;
  price: number;
  location?: string;
  imageUrl?: string;
  status: MentosStatus;
  children?: ReactNode;

  onReviewClick?: () => void;
  onDeleteClick?: () => void;
  onRefundClick?: () => void;
  onReportClick?: () => void;
  onUpdateClick?: () => void;
}

const statusStyles: Record<MentosStatus, string> = {
  completed: "bg-[#2E3849]", // 진행 완료
  pending: "bg-[#B3B6B8]", // 진행 전
  mento: "bg-[#2E3849]", // 멘토용 카드 배지(원 코드엔 별도 배지 문구 없음)
};

const statusTextMap: Partial<Record<MentosStatus, string>> = {
  completed: "진행 완료",
  pending: "진행 전",
  // mento 상태는 배지 텍스트가 없으면 공백으로 처리
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
}: MentosCardProps) {
  const statusClassName = statusStyles[status] ?? "";
  const statusText = statusTextMap[status] ?? "";
  const formattedPrice = Number.isFinite(price) ? price.toLocaleString() : String(price);

  const actionButton = (() => {
    switch (status) {
      case "completed":
        return (
          <>
            <Button className="text-xs" variant="lightBlue" size="sm" onClick={onReviewClick}>
              리뷰작성
            </Button>
            <Button className="text-xs" variant="danger" size="sm" onClick={onReportClick}>
              신고하기
            </Button>
          </>
        );
      case "pending":
        return (
          <Button className="text-xs" variant="refund" size="sm" onClick={onRefundClick}>
            환불하기
          </Button>
        );
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
    <div className="relative flex h-auto w-[80vw] max-w-[360px] flex-col rounded-[10px] border-[1px] border-solid border-[#E5E7ED] bg-white">
      <Link to={`/mentee/mentos-detail/${mentosSeq}`}>
        <section className="h-[15vh]">
          <img
            className="h-full w-full rounded-t-[10px]"
            src={imageUrl || "https://picsum.photos/seed/picsum/200/300"}
            alt="mentos card"
          />
          {/* 진행 상태 배지 (멘토 상태는 텍스트 없으면 렌더 생략) */}
          {statusText && (
            <div
              className={`${statusClassName} absolute top-2 right-2 rounded-[65px] px-2 py-1 text-xs text-white`}>
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
