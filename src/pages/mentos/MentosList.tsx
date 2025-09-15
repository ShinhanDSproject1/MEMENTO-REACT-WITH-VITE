// src/pages/mentos/MentosList.tsx
import { useMentosInfiniteList } from "@/features";
import { MentosCard } from "@widgets/common";
import { MentosMainTitleComponent } from "@widgets/mentos";
import { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

const LIMIT = 5;

const TITLE_MAP: Record<string, string> = {
  consumption: "소비패턴 멘토링",
  tips: "생활노하우 멘토링",
  saving: "저축방식 멘토링",
  growth: "자산증식 멘토링",
};

const CATEGORY_ID_MAP: Record<string, number> = {
  consumption: 1,
  tips: 2,
  saving: 3,
  growth: 4,
};

export default function MentosList() {
  const { category } = useParams<{ category?: string }>();
  const mainTitle = useMemo(() => (category ? (TITLE_MAP[category] ?? "") : ""), [category]);
  const categoryId = category ? CATEGORY_ID_MAP[category] : undefined;

  // hook은 여기서만 호출해야 함
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useMentosInfiniteList(categoryId ?? 0, LIMIT);

  const list = data?.pages.flatMap((p) => p.result.mentos) ?? [];
  const empty = status === "success" && !isLoading && !isError && list.length === 0;

  useEffect(() => {
    if (!loaderRef.current || !hasNextPage) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        });
      },
      { rootMargin: "200px 0px" },
    );

    io.observe(loaderRef.current);
    return () => io.disconnect();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (!categoryId) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center bg-[#f5f6f8]">
        <span className="text-sm text-gray-500">잘못된 카테고리입니다.</span>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full bg-white px-4 py-5">
        <MentosMainTitleComponent mainTitle={mainTitle} />

        {isLoading && (
          <div className="py-10 text-center text-sm text-gray-500">목록을 불러오는 중…</div>
        )}
        {isError && (
          <div className="flex items-center justify-center gap-3 py-10 text-sm">
            <span className="text-red-500">목록을 불러오지 못했습니다.</span>
            <button onClick={() => refetch()} className="rounded bg-blue-600 px-3 py-1 text-white">
              다시 시도
            </button>
          </div>
        )}
        {empty && (
          <div className="py-10 text-center text-sm text-gray-500">표시할 멘토링이 없어요.</div>
        )}

        <section className="flex w-full flex-col items-center space-y-4">
          {list.map((item) => (
            <MentosCard
              key={item.mentosSeq}
              mentosSeq={item.mentosSeq}
              title={item.mentosTitle}
              price={item.mentosPrice}
              location={item.region}
              status={"guest"}
              imageUrl={item.mentosImg}
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
      </section>
    </div>
  );
}
