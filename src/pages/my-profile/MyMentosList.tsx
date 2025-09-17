// src/pages/MyMentosList.tsx
import { useMyMentosInfiniteList } from "@/features/mentos-list/hooks/useMyMentosInfiniteList";
import Button from "@/widgets/common/Button";
import MentosCard from "@/widgets/common/MentosCard";
import MentosMainTitleComponent from "@/widgets/mentos/MentosMainTitleComponent";
import type { MyMentosItem } from "@entities/mentos";
import { createReport } from "@entities/mentos/api/createReport";
import { deleteMentoMentos } from "@entities/mentos/api/deleteMentoMentos";
import type { ReportType } from "@entities/mentos/model/types";
import { useMentoMentosInfiniteList } from "@features/mentos-list";
import { useModal } from "@hooks/ui/useModal";
import { CommonModal } from "@widgets/common";
import { useEffect, useMemo, useRef, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { refundPayment } from "@/shared/api/payments";

type Role = "mento" | "menti";

type ModalType =
  | "deleteMentos"
  | "deleteComplete"
  | "deleteFailed"
  | "loading"
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

// 컴포넌트 상단에 유틸 추가
function getPaymentSeq(it: any): number | undefined {
  return (
    it?.paymentsSeq ??
    it?.paymentSeq ??
    it?.paySeq ??
    it?.paymentId ??
    it?.payment?.paymentsSeq ??
    it?.payment?.paymentSeq ??
    // ★ 최후 fallback: 결제 직후 저장해 둔 값 사용
    getPaymentSeqFromLS(it?.mentosSeq)
  );
}
function getPaymentSeqFromLS(mentosSeq: number): number | undefined {
  const v = localStorage.getItem(`paymentSeqByMentos:${mentosSeq}`);
  return v ? Number(v) : undefined;
}

const MyMentosList: FC<MyMentosListProps> = ({ role }) => {
  const { isOpen, modalType, openModal, closeModal, modalData } = useModal() as UseModalReturn;
  const navigate = useNavigate();

  /** 확인 버튼 공통 핸들러 */
  const handleConfirmAction = async () => {
    // 환불
    if (modalType === "refundMentos") {
      const { paymentsSeq } = (modalData ?? {}) as { paymentsSeq?: number };
      if (!paymentsSeq) {
        alert("결제 정보가 없습니다. 새로고침 후 다시 시도해주세요.");
        return closeModal();
      }

      openModal("loading", {
        title: "환불 처리 중입니다…",
        description: "잠시만 기다려주세요 ⏳",
      });

      try {
        const res = await refundPayment(paymentsSeq);
        closeModal(); // loading 닫기
        if (res?.status === 200 || res?.code === 1000) {
          openModal("refundComplete");
          await mentee.refetch?.();
        } else {
          openModal("deleteFailed", { message: res?.message ?? "환불에 실패했습니다." });
        }
      } catch (e: any) {
        closeModal();
        openModal("deleteFailed", {
          message: e?.response?.data?.message ?? "환불 중 오류가 발생했습니다.",
        });
      }
      return;
    }
    // 삭제 확인 모달에서 확인 클릭 시
    if (modalType === "deleteMentos") {
      const { mentosSeq } = (modalData ?? {}) as { mentosSeq?: number };
      if (!mentosSeq) return closeModal();

      // 로딩 모달 표시
      openModal("loading", {
        title: "삭제 중입니다…",
        description: "잠시만 기다려주세요 ⏳",
      });

      try {
        const res = await deleteMentoMentos(mentosSeq);
        closeModal(); // loading 닫기
        if (res.code === 1000) {
          openModal("deleteComplete");
          // 목록 새로고침 (멘토 전용)
          mentor.refetch();
        } else {
          openModal("deleteFailed", { message: res.message || "삭제에 실패했습니다." });
        }
      } catch {
        closeModal(); // loading 닫기
        openModal("deleteFailed", { message: "삭제 중 오류가 발생했습니다." });
      }
      return;
    }

    if (modalType === "dismissUser") return (closeModal(), openModal("dismissSuccess"));
    // if (modalType === "refundMentos") return (closeModal(), openModal("refundComplete"));

    // 나머지는 단순 닫기
    closeModal();
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
      if (!mentosSeq || !reportType || !idemKey) return;

      await createReport({
        requestDto: { reportType, mentosSeq },
        imageFile: imageFile ?? null,
        idemKey,
      });

      closeModal();
      openModal("reportComplete");
    }
  };

  // 아이템별 핸들러
  const onReviewClick = (mentosSeq: number) =>
    openModal("reviewMentos", { title: "리뷰 작성", mentosSeq });
  const onDeleteClick = (mentosSeq: number) => openModal("deleteMentos", { mentosSeq });
  const onUpdateClick = (mentosSeq: number) => navigate(`/edit/${mentosSeq}`);
  const onReportClick = (mentosSeq: number) =>
    openModal("reportMentos", { title: "신고하기", mentosSeq, idemKey: crypto.randomUUID() });
  const onRefundClick = (paymentsSeq: number) => openModal("refundMentos", { paymentsSeq });
  /* -------------------- 멘토 / 멘티 데이터 훅 -------------------- */
  // 멘티
  const mentee = useMyMentosInfiniteList(5, { enabled: role === "menti" });
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

  // MyMentosList 컴포넌트 안, menteeList 계산 아래 아무 데나
  useEffect(() => {
    if (menteeList.length) {
      console.log("[refund-debug] first item:", menteeList[0]);
    }
  }, [menteeList]);

  // ✅ 새로고침 강제
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
            const pseq = getPaymentSeq(item);
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
                onReviewClick={() => onReviewClick(item.mentosSeq)}
                onRefundClick={() =>
                  pseq ? onRefundClick(pseq) : alert("해당 항목에는 결제 내역이 없습니다.")
                }
                // 선택: 결제 PK 없으면 버튼 비활성화(컴포넌트 prop이 있다면 사용)
                refundDisabled={!pseq}
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
          onConfirm={handleConfirmAction}
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
