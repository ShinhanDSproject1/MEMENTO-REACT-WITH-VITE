// src/pages/MyMentosList.tsx
import { createReview } from "@/entities/review/api/createReview";

import { useMyMentosInfiniteList } from "@/features/mentos-list/hooks/useMyMentosInfiniteList";
import { refundPayment } from "@/shared/api/payments";
import Button from "@/widgets/common/Button";
import MentosCard from "@/widgets/common/MentosCard";
import MentosMainTitleComponent from "@/widgets/mentos/MentosMainTitleComponent";
import type { MyMentosItem } from "@entities/mentos";
import { createReport } from "@entities/mentos/api/createReport";
import { deleteMentoMentos } from "@entities/mentos/api/deleteMentoMentos";
import type { ReportType } from "@entities/mentos/model/types";
import { useMentoMentosInfiniteList } from "@features/mentos-list";
import { useModal } from "@hooks/ui/useModal";
import type { ModalKey } from "@shared/ui/ModalConfig";
import { useQueryClient } from "@tanstack/react-query";
import { CommonModal } from "@widgets/common";
import { useEffect, useMemo, useRef, type FC } from "react";
import { useNavigate } from "react-router-dom";

// ----- Types -----
type Role = "mento" | "menti";

// useModal 반환 타입(설정 키 재사용)
type UseModalReturn = {
  isOpen: boolean;
  modalType?: ModalKey;
  modalData?: Record<string, unknown>;
  openModal: (type: ModalKey, data?: Record<string, unknown>) => void;
  closeModal: () => void;
};

interface MyMentosListProps {
  role: Role;
}

// ─────────────────────────────────────────────────────────────
// helpers
// ─────────────────────────────────────────────────────────────
const MY_MENTOS_QK = ["my-mentos-list"] as const;

function getPaymentSeqFromLS(mentosSeq: number): number | undefined {
  const v = localStorage.getItem(`paymentSeqByMentos:${mentosSeq}`);
  return v ? Number(v) : undefined;
}
function getPaymentSeq(it: any): number | undefined {
  return (
    it?.reservationSeq ??
    it?.paymentSeq ??
    it?.paySeq ??
    it?.paymentId ??
    it?.payment?.reservationSeq ??
    it?.payment?.paymentSeq ??
    getPaymentSeqFromLS(it?.mentosSeq)
  );
}

/** 리뷰 완료를 캐시에 즉시 반영 (infinite query 가정: {pages:[{result:{content:[]}}]} ) */
function markReviewedInCache(
  queryClient: ReturnType<typeof useQueryClient>,
  reservationSeq?: number,
) {
  if (!reservationSeq) return;
  queryClient.setQueryData<any>(MY_MENTOS_QK, (old) => {
    if (!old) return old;
    // react-query infinite 형태: { pages, pageParams }
    const next = {
      ...old,
      pages: old.pages?.map((pg: any) => {
        if (!pg?.result?.content) return pg;
        const newContent = pg.result.content.map((it: any) =>
          it?.reservationSeq === reservationSeq ? { ...it, reviewCompleted: true } : it,
        );
        return { ...pg, result: { ...pg.result, content: newContent } };
      }),
    };
    return next;
  });
}

interface ReviewModalData {
  mentosSeq?: number; // 사용 안 해도 남겨둠(타입 호환)
  initialRating?: number;
  initialContent?: string;
  reservationSeq?: number; // 실제 사용 필드
  onRatingChange?: (r: number) => void;
  onContentChange?: (t: string) => void;
}

interface ReportModalData {
  mentosSeq?: number;
  reportType?: ReportType;
  imageFile?: File | null;
  idemKey?: string; // 신고는 멱등키 사용
}

const MyMentosList: FC<MyMentosListProps> = ({ role }) => {
  // 리뷰 임시 입력 저장소 (모달 내부 입력 콜백으로 채움)
  const reviewDraftRef = useRef<{ rating: number; content: string }>({ rating: 0, content: "" });

  const { isOpen, modalType, openModal, closeModal, modalData } = useModal() as UseModalReturn;
  const navigate = useNavigate();

  /** 공통 확인 핸들러 */
  const handleConfirmAction = async () => {
    // 환불
    if (modalType === "refundMentos") {
      const { reservationSeq } = (modalData ?? {}) as { reservationSeq?: number };
      if (!reservationSeq) {
        openModal("faildPayment", {
          message: "결제 정보가 없습니다. 새로고침 후 다시 시도해주세요.",
        });
        return closeModal();
      }

      openModal("loading", {
        title: "환불 처리 중입니다…",
        description: "잠시만 기다려주세요 ⏳",
      });
      try {
        const res = await refundPayment(reservationSeq);
        closeModal();
        if (res?.status === 200 || res?.code === 1000) {
          await queryClient.invalidateQueries({ queryKey: MY_MENTOS_QK });
          await mentee.refetch?.();
          openModal("refundComplete");
        } else {
          openModal("faildPayment", { message: res?.message ?? "환불에 실패했습니다." });
        }
      } catch (e: any) {
        closeModal();
        openModal("faildPayment", {
          message: e?.response?.data?.message ?? "환불 중 오류가 발생했습니다.",
        });
      }
      return;
    }

    if (modalType === "deleteMentos") {
      const { mentosSeq } = (modalData ?? {}) as { mentosSeq?: number };
      if (!mentosSeq) return closeModal();
      openModal("loading", {
        title: "삭제 중입니다…",
        description: "잠시만 기다려주세요 ⏳",
      });

      try {
        const res = await deleteMentoMentos(mentosSeq);
        closeModal();
        if (res.code === 1000) {
          openModal("deleteComplete");
          mentor.refetch();
        } else {
          openModal("withdrawFailed", { message: res.message || "삭제에 실패했습니다." });
        }
      } catch {
        closeModal();
        openModal("withdrawFailed", { message: "삭제 중 오류가 발생했습니다." });
      }
      return;
    }

    if (modalType === "dismissUser") {
      closeModal();
      openModal("dismissSuccess");
      return;
    }

    // 나머지 모달은 단순 닫기
    closeModal();
  };

  const handleCancelAction = () => closeModal();

  /** 제출 핸들러 (form 모달의 '등록'/'신고' 버튼) */
  const handleSubmit = async () => {
    // --- 리뷰 작성 ---
    if (modalType === "reviewMentos") {
      const { reservationSeq } = (modalData ?? {}) as ReviewModalData;
      const { rating, content } = reviewDraftRef.current;

      if (!reservationSeq) {
        openModal("needReviewContent", { message: "예약 정보가 없습니다." });
        return;
      }
      if (!rating || !content.trim()) {
        openModal("needReviewContent", { message: "별점과 내용을 입력하세요." });
        return;
      }

      openModal("loading", { title: "리뷰 작성 중…", description: "잠시만 기다려주세요 ⏳" });

      try {
        const res = await createReview({
          reservationSeq,
          reviewRating: rating,
          reviewContent: content,
        });
        closeModal(); // loading 닫기

        if (res.code === 1000) {
          // 1) 캐시 즉시 반영
          markReviewedInCache(queryClient, reservationSeq);
          // 2) 완료 모달
          openModal("reviewComplete");
          // 3) 서버 최신 동기화
          await queryClient.invalidateQueries({ queryKey: MY_MENTOS_QK });
          await mentee.refetch?.();
        } else {
          openModal("withdrawFailed", { message: res.message || "리뷰 작성에 실패했습니다." });
        }
      } catch {
        closeModal();
        openModal("withdrawFailed", { message: "리뷰 작성에 실패했습니다." });
      }
      return;
    }

    // --- 신고 작성 ---
    if (modalType === "reportMentos") {
      const { mentosSeq, reportType, imageFile, idemKey } = (modalData ?? {}) as ReportModalData;
      if (!mentosSeq || !reportType || !idemKey) {
        openModal("withdrawFailed", { message: "신고 정보가 올바르지 않습니다." });
        return;
      }

      try {
        openModal("loading", { title: "신고 접수 중…", description: "잠시만 기다려주세요 ⏳" });
        await createReport({
          requestDto: { reportType, mentosSeq },
          imageFile: imageFile ?? null,
          idemKey,
        });
        closeModal();
        openModal("reportComplete");
      } catch {
        closeModal();
        openModal("withdrawFailed", { message: "신고 접수에 실패했습니다." });
      }
      return;
    }
  };

  // 아이템별 액션
  const onReviewClick = (reservationSeq?: number, alreadyCompleted?: boolean) => {
    if (alreadyCompleted) {
      openModal("withdrawFailed", { message: "이미 리뷰를 작성한 항목입니다." });
      return;
    }
    openModal("reviewMentos", {
      title: "리뷰 작성",
      reservationSeq,
      initialRating: 3,
      initialContent: "",
      onRatingChange: (r: number) => {
        reviewDraftRef.current.rating = r;
      },
      onContentChange: (t: string) => {
        reviewDraftRef.current.content = t;
      },
    });
  };

  const onDeleteClick = (mentosSeq: number) => openModal("deleteMentos", { mentosSeq });

  const onUpdateClick = (mentosSeq: number) => navigate(`/edit/${mentosSeq}`);

  const onReportClick = (mentosSeq: number) =>
    openModal("reportMentos", { title: "신고하기", mentosSeq, idemKey: crypto.randomUUID() });
  const onRefundClick = (reservationSeq: number) => openModal("refundMentos", { reservationSeq });

  // 멘티
  const mentee = useMyMentosInfiniteList(5, { enabled: role === "menti" });
  const queryClient = useQueryClient();
  const menteeList = useMemo(() => {
    const seen = new Set<number>();
    return (mentee.data?.pages ?? [])
      .flatMap((p) => p.result.content)
      .filter((it) => {
        if (seen.has(it.mentosSeq)) return false;
        seen.add(it.mentosSeq);
        return true;
      });
  }, [mentee.data]);
  const menteeEmpty = !mentee.isLoading && !mentee.isError && menteeList.length === 0;

  useEffect(() => {
    if (role === "menti") mentee.refetch();
  }, [role]);

  // 멘토
  const mentor = useMentoMentosInfiniteList(5, { enabled: role === "mento" });
  const mentorList = useMemo(() => {
    const seen = new Set<number>();
    return (mentor.data?.pages ?? [])
      .flatMap((p) => p.content)
      .filter((it) => {
        if (seen.has(it.mentosSeq)) return false;
        seen.add(it.mentosSeq);
        return true;
      });
  }, [mentor.data]);
  const mentorEmpty = !mentor.isLoading && !mentor.isError && mentorList.length === 0;

  const loaderRef = useRef<HTMLDivElement | null>(null);

  // 무한 스크롤 옵저버
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

          <section className="flex w-full flex-col items-center gap-4">
            {mentorList.map((item) => (
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

          {mentor.hasNextPage && !mentorEmpty && <div ref={loaderRef} className="h-10 w-full" />}
          {mentor.isFetchingNextPage && (
            <div className="py-4 text-center text-sm text-gray-500">더 불러오는 중…</div>
          )}
          {!mentor.hasNextPage && !mentorEmpty && mentorList.length > 0 && (
            <div className="py-6 text-center text-xs text-gray-400">마지막 페이지입니다.</div>
          )}

          {isOpen && modalType ? (
            <CommonModal
              type={modalType}
              onConfirm={handleConfirmAction}
              onCancel={handleCancelAction}
              isOpen={isOpen}
              onSubmit={handleSubmit}
              modalData={modalData}
            />
          ) : null}
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
          menteeList.map((item: MyMentosItem) => {
            return (
              <MentosCard
                key={item.mentosSeq}
                mentosSeq={item.mentosSeq}
                title={item.mentosTitle}
                price={item.price}
                location={item.region}
                status={item.progressStatus === "진행 완료" ? "completed" : "pending"}
                imageUrl={item.mentosImage}
                onReportClick={() => onReportClick(item.mentosSeq)}
                onReviewClick={() => onReviewClick(item.reservationSeq, item.reviewCompleted)}
                onRefundClick={() =>
                  item.reservationSeq
                    ? onRefundClick(item.reservationSeq)
                    : openModal("withdrawFailed", {
                        message: "해당 항목에는 예약 내역이 없습니다.",
                      })
                }
                refundDisabled={!item.reservationSeq}
                reviewDisabled={item.reviewCompleted} // ✅ 리뷰 완료 시 버튼 비활성화
              />
            );
          })}

        {mentee.hasNextPage && !menteeEmpty && <div ref={loaderRef} className="h-10 w-full" />}
        {mentee.isFetchingNextPage && (
          <div className="py-4 text-center text-sm text-gray-500">더 불러오는 중…</div>
        )}
        {!mentee.hasNextPage && !menteeEmpty && menteeList.length > 0 && (
          <div className="py-6 text-center text-xs text-gray-400">마지막 페이지입니다.</div>
        )}
      </section>

      {isOpen && modalType ? (
        <CommonModal
          type={modalType}
          onConfirm={
            modalType === "reviewMentos" || modalType === "reportMentos"
              ? handleSubmit
              : handleConfirmAction
          }
          onCancel={handleCancelAction}
          isOpen={isOpen}
          onSubmit={handleSubmit}
          modalData={modalData}
        />
      ) : null}
    </div>
  );
};

export default MyMentosList;
