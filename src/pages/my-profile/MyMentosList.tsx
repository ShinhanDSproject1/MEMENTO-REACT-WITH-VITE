// src/pages/MyMentosList.tsx
import { useMyMentosInfiniteList } from "@/features/mentos-list/hooks/useMyMentosInfiniteList";
import Button from "@/widgets/common/Button";
import MentosCard from "@/widgets/common/MentosCard";
import MentosMainTitleComponent from "@/widgets/mentos/MentosMainTitleComponent";
import type { MentorMentosItem, MyMentosItem } from "@entities/mentos";
import { useMentoMentosInfiniteList } from "@features/mentos-list";
import { useModal } from "@hooks/ui/useModal";
import { CommonModal } from "@widgets/common";
import { useEffect, useRef, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { createReport } from "@entities/mentos/api/createReport";
import type { ReportType } from "@entities/mentos/model/types";

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

  const handleSubmit = async () => {
    if (modalType === "reviewMentos") {
      closeModal();
      openModal("reviewComplete");
      return;
    }

    if (modalType === "reportMentos") {
      const { mentosSeq, reportType, imageFile, idemKey } = (modalData ?? {}) as {
        mentosSeq?: number;
        reportType?: ReportType;
        imageFile?: File | null;
        idemKey?: string;
      };

      if (!mentosSeq || !reportType || !idemKey) {
        // TODO: 토스트/알림으로 필수값 안내
        return;
      }

      await createReport({
        requestDto: { reportType, mentosSeq },
        imageFile: imageFile ?? null,
        idemKey, // ✅ 모달에서 생성한 키 그대로 사용 (재시도에도 동일)
      });

      closeModal();
      openModal("reportComplete");
    }
  };

  // 클릭 핸들러(아이템별로 mentosSeq 주입)
  const onReviewClick = (mentosSeq: number) =>
    openModal("reviewMentos", { title: "리뷰 작성", mentosSeq });
  const onDeleteClick = (mentosSeq: number) => openModal("deleteMentos", { mentosSeq });
  const onUpdateClick = (mentosSeq: number) => navigate(`/edit/${mentosSeq}`); // TODO: 실제 라우팅 규칙 확인
  const onReportClick = (mentosSeq: number) =>
    openModal("reportMentos", {
      title: "신고하기",
      mentosSeq,
      idemKey: crypto.randomUUID(),
    });
  const onRefundClick = (mentosSeq: number) => openModal("refundMentos", { mentosSeq });

  /* -------------------- 멘토 / 멘티 각각의 데이터 훅 -------------------- */
  // 멘티 목록(기존): 각 page가 ApiResponse 형태라서 p.result.content
  const mentee = useMyMentosInfiniteList(5);
  const menteeList = mentee.data?.pages.flatMap((p) => p.result.content) ?? [];
  const menteeEmpty = !mentee.isLoading && !mentee.isError && menteeList.length === 0;

  // 멘토 목록(신규): API가 result만 반환하므로 각 page는 MentorMentosListResult,
  // 즉 p.content 로 바로 접근
  const mentor = useMentoMentosInfiniteList(5);
  const mentorList = mentor.data?.pages.flatMap((p) => p.content) ?? [];
  const mentorEmpty = !mentor.isLoading && !mentor.isError && mentorList.length === 0;

  const isEmpty = !isLoading && !isError && list.length === 0;
  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 무한 스크롤 옵저버: role에 맞는 훅으로 분기
  useEffect(() => {
    const hasNext = role === "mento" ? mentor.hasNextPage : mentee.hasNextPage;
    const fetching = role === "mento" ? mentor.isFetchingNextPage : mentee.isFetchingNextPage;
    const loadMore = role === "mento" ? mentor.fetchNextPage : mentee.fetchNextPage;

    if (!loaderRef.current || !hasNext) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting) && hasNext && !fetching) {
          loadMore();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(loaderRef.current);
    return () => io.disconnect();
  }, [
    role,
    mentor.hasNextPage,
    mentor.isFetchingNextPage,
    mentor.fetchNextPage,
    mentee.hasNextPage,
    mentee.isFetchingNextPage,
    mentee.fetchNextPage,
  ]);

  /* -------------------------------- 멘토 뷰 -------------------------------- */
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

          {/* 로딩 / 에러 / 빈 상태 */}
          {mentor.isLoading && <div className="py-6 text-center text-sm">불러오는 중…</div>}
          {mentor.isError && (
            <div className="py-6 text-center text-sm text-red-500">
              데이터를 불러오지 못했습니다.
              <button
                onClick={() => mentor.refetch()}
                className="ml-2 rounded bg-blue-500 px-2 py-1 text-white">
                다시 시도
              </button>
            </div>
          )}
          {mentorEmpty && (
            <div className="py-10 text-center text-sm text-gray-500">등록된 멘토링이 없습니다.</div>
          )}

          {/* 리스트 */}
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
                onUpdateClick={() => onUpdateClick(item.mentosSeq)}
                onDeleteClick={() => onDeleteClick(item.mentosSeq)}
              />
            ))}
          </section>

          {/* 무한 스크롤 트리거 */}
          {mentor.hasNextPage && !mentorEmpty && <div ref={loaderRef} className="h-10 w-full" />}
          {mentor.isFetchingNextPage && (
            <div className="py-4 text-center text-sm text-gray-500">더 불러오는 중…</div>
          )}
          {!mentor.hasNextPage && !mentorEmpty && mentorList.length > 0 && (
            <div className="py-6 text-center text-xs text-gray-400">마지막 페이지입니다.</div>
          )}

          {/* 모달 */}
          <CommonModal
            type={modalType ?? undefined}
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

  /* -------------------------------- 멘티 뷰 -------------------------------- */
  return (
    <div className="no-scrollbar flex min-h-screen w-full flex-col gap-4 overflow-y-auto bg-white pb-4">
      <MentosMainTitleComponent mainTitle={"나의 멘토링 내역"} />

      {mentee.isLoading && <div className="py-6 text-center text-sm">불러오는 중…</div>}
      {mentee.isError && (
        <div className="py-6 text-center text-sm text-red-500">
          데이터를 불러오지 못했습니다.
          <button
            onClick={() => mentee.refetch()}
            className="ml-2 rounded bg-blue-500 px-2 py-1 text-white">
            다시 시도
          </button>
        </div>
      )}
      {menteeEmpty && (
        <div className="py-10 text-center text-sm text-gray-500">데이터가 없습니다.</div>
      )}

      <section className="flex w-full flex-col items-center gap-3">
        {!menteeEmpty &&
          menteeList.map((item: MyMentosItem) => (
            <MentosCard
              key={item.mentosSeq}
              mentosSeq={item.mentosSeq}
              title={item.mentosTitle}
              price={item.price}
              location={item.region}
              status={item.progressStatus === "진행 완료" ? "completed" : "pending"}
              imageUrl={item.mentosImage}
              onReportClick={() => onReportClick(item.mentosSeq)}
              onReviewClick={() => onReviewClick(item.mentosSeq)}
              onRefundClick={() => onRefundClick(item.mentosSeq)}
            />
          ))}

        {mentee.hasNextPage && !menteeEmpty && <div ref={loaderRef} className="h-10 w-full" />}
        {mentee.isFetchingNextPage && (
          <div className="py-4 text-center text-sm text-gray-500">더 불러오는 중…</div>
        )}
        {!mentee.hasNextPage && !menteeEmpty && menteeList.length > 0 && (
          <div className="py-6 text-center text-xs text-gray-400">마지막 페이지입니다.</div>
        )}
      </section>

      <CommonModal
        type={modalType ?? undefined}
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
