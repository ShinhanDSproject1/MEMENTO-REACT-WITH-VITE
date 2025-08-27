import React from "react";
import PropTypes from "prop-types";
import Button from "@/components/common/Button";

const statusStyles = {
  completed: "bg-[#2E3849]", // 진행 완료
  pending: "bg-[#B3B6B8]", // 진행 전
};

function MentosCard({ children, title, price, location, status, imageUrl, ...props }) {
  const statusClassName = statusStyles[status] || "";
  const statusText =
    {
      completed: "진행 완료",
      pending: "진행 전",
    }[status] || "";

  const formattedPrice = price.toLocaleString();

  const actionButton = (() => {
    switch (status) {
      case "completed":
        return (
          <>
            <Button className="text-xs" variant="lightBlue" size="sm">
              리뷰작성
            </Button>
            <Button className="text-xs" variant="danger" size="sm">
              신고하기
            </Button>
          </>
        );
      case "pending":
        return (
          <Button className="text-xs" variant="refund" size="sm">
            환불하기
          </Button>
        );
      case "mento":
        return (
          <>
            <Button className="text-xs" variant="lightBlue" size="sm">
              수정하기
            </Button>
            <Button className="text-xs" variant="danger" size="sm">
              삭제하기
            </Button>
          </>
        );
      default:
        return null; // 상태가 없을 경우 버튼을 렌더링하지 않음
    }
  })();

  return (
    <div className="relative flex h-auto w-[80vw] max-w-[360px] flex-col rounded-[10px] border-[1px] border-solid border-[#E5E7ED] bg-white">
      <section className="h-[15vh]">
        <img
          className="h-full w-full rounded-t-[10px]"
          src="https://picsum.photos/seed/picsum/200/300"
          alt="card image"
        />
        {/* 진행 완료 배지 */}
        <div
          className={`${statusClassName} absolute top-2 right-2 rounded-[65px] px-2 py-1 text-xs text-white`}>
          {statusText}
        </div>
      </section>
      <section className="item-center flex flex-col gap-2 border-t px-4 py-2">
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

// PropTypes 정의
MentosCard.propTypes = {
  title: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
  location: PropTypes.string,
  imageUrl: PropTypes.string,
  status: PropTypes.oneOf(["completed", "pending", "mento"]),
  children: PropTypes.node,
};
export default MentosCard;
