import { useMyMentosInfinite } from "@/features/mentos-list/hooks/useMyMentosInfiniteList";
import Button from "@/widgets/common/Button";
import MentosCard from "@/widgets/common/MentosCard";
import MentosMainTitleComponent from "@/widgets/mentos/MentosMainTitleComponent";
import type { MyMentosItem } from "@entities/mentos";
import { useModal } from "@hooks/ui/useModal";
import { CommonModal } from "@widgets/common";
import { useEffect, useRef, type FC } from "react";
import { useNavigate } from "react-router-dom";

type Role = "mento" | "menti";

type ModalType =
  | "deleteMentos"
  | "deleteComplete"
  | "dismissUser"
  | "dismissSuccess"
  | "refundMentos"
  | "refundComplete"
  | "reviewMentos"
  | "reviewComplete"
  | "reportMentos"
  | "reportComplete";

type UseModalReturn = {
  isOpen: boolean;
  modalType?: ModalType;
  modalData?: Record<string, unknown>;
  openModal: (type: ModalType, data?: Record<string, unknown>) => void;
  closeModal: () => void;
};

interface MyMentosListProps {
  role: Role;
}

const MyMentosList: FC<MyMentosListProps> = ({ role }) => {
  const { isOpen, modalType, openModal, closeModal, modalData } = useModal() as UseModalReturn;
  const navigate = useNavigate();

  const handleConfirmAction = () => {
    closeModal();
    if (modalType === "deleteMentos") return openModal("deleteComplete");
    if (modalType === "dismissUser") return openModal("dismissSuccess");
    if (modalType === "refundMentos") return openModal("refundComplete");
  };

  const handleCancelAction = () => closeModal();

  const handleSubmit = () => {
    closeModal();
    if (modalType === "reviewMentos") openModal("reviewComplete");
    if (modalType === "reportMentos") openModal("reportComplete");
  };

  const onReviewClick = () => openModal("reviewMentos", { title: "리뷰 작성" });
  const onDeleteClick = () => openModal("deleteMentos");
  const onUpdateClick = () => navigate("/edit/1"); // TODO: 실제 id 교체
  const onReportClick = () => openModal("reportMentos", { title: "신고하기" });
  const onRefundClick = () => openModal("refundMentos");

  // role === 'menti' → API 연결
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useMyMentosInfinite(5);

  const list = data?.pages.flatMap((p) => p.result.content) ?? [];
  const loaderRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(loaderRef.current);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (role === "mento") {
    return (
      <div className="flex min-h-screen w-full justify-center bg-[#f5f6f8] antialiased">
        <section className="w-full bg-white px-4 py-5 shadow">
          <div className="mt-6 mb-15 flex w-full items-baseline justify-between">
            <h1 className="font-WooridaumB pl-2 text-[20px] font-bold">멘토링 관리</h1>
            <Button
              variant="primary"
              size="sm"
              className="!h-[32px] !rounded-[8px] !px-3 !text-[13px]"
              onClick={() => navigate("/create-mentos")}>
              멘토링 생성하기
            </Button>
          </div>

          {/* ✅ 멘토도 API 연결 가능하도록 확장 예정 */}
          <section className="flex w-full flex-col items-center gap-4">
            {list.map((item: MyMentosItem) => (
              <MentosCard
                key={item.mentosSeq}
                mentosSeq={item.mentosSeq}
                title={item.mentosTitle}
                price={item.price}
                location={item.region}
                status="mento"
                imageUrl={item.mentosImage}
                onUpdateClick={onUpdateClick}
                onDeleteClick={onDeleteClick}
              />
            ))}
          </section>

          <CommonModal
            type={"deleteMentos"}
            onConfirm={handleConfirmAction}
            onCancel={handleCancelAction}
            isOpen={isOpen}
            onSubmit={handleSubmit}
            modalData={modalData}
          />
        </section>
      </div>
    );
  }

  // role === 'menti'
  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col gap-4 overflow-y-auto bg-white pb-4">
      <MentosMainTitleComponent mainTitle={"나의 멘토링 내역"} />

      {isLoading && <div className="py-6 text-center text-sm">불러오는 중…</div>}
      {isError && (
        <div className="py-6 text-center text-sm text-red-500">
          데이터를 불러오지 못했습니다.
          <button
            onClick={() => refetch()}
            className="ml-2 rounded bg-blue-500 px-2 py-1 text-white">
            다시 시도
          </button>
        </div>
      )}

      <section className="flex w-full flex-col items-center gap-3">
        {list.map((item: MyMentosItem) => (
          <MentosCard
            key={item.mentosSeq}
            mentosSeq={item.mentosSeq}
            title={item.mentosTitle}
            price={item.price}
            location={item.region}
            status={item.progressStatus === "진행 완료" ? "completed" : "pending"}
            imageUrl={item.mentosImage}
            onReportClick={onReportClick}
            onReviewClick={onReviewClick}
            onRefundClick={onRefundClick}
          />
        ))}

        {hasNextPage && <div ref={loaderRef} className="h-10 w-full" />}
        {isFetchingNextPage && (
          <div className="py-4 text-center text-sm text-gray-500">더 불러오는 중…</div>
        )}
        {!hasNextPage && list.length > 0 && (
          <div className="py-6 text-center text-xs text-gray-400">마지막 페이지입니다.</div>
        )}
      </section>

      <CommonModal
        type={"deleteMentos"}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        isOpen={isOpen}
        onSubmit={handleSubmit}
        modalData={modalData}
      />
    </div>
  );
};

export default MyMentosList;
