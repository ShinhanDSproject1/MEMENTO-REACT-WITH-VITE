// src/pages/mentos/MentosList.tsx
import MentosCard from "@/widgets/common/MentosCard";
import MentosMainTitleComponent from "@/widgets/mentos/MentosMainTitleComponent";
import type { MentosCategory } from "@entities/mentos";
import { useMentosListQuery } from "@features/mentos";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

const TITLE_MAP: Record<MentosCategory, string> = {
  consumption: "소비패턴 멘토링",
  tips: "생활노하우 멘토링",
  saving: "저축방식 멘토링",
  growth: "자산증식 멘토링",
};

export default function MentosList() {
  const { category } = useParams<{ category?: MentosCategory }>();
  const mainTitle = useMemo(() => (category ? (TITLE_MAP[category] ?? "") : ""), [category]);

  const { data, isLoading, isError, refetch } = useMentosListQuery(category);

  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5">
        <MentosMainTitleComponent mainTitle={mainTitle} />

        {/* 상태 영역 */}
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

        {!isLoading && !isError && (data?.items?.length ?? 0) === 0 && (
          <div className="py-10 text-center text-sm text-gray-500">표시할 멘토링이 없어요.</div>
        )}

        {/* 리스트 */}
        <section className="flex w-full flex-col items-center space-y-4 overflow-x-hidden bg-white px-4 py-5">
          {data?.items?.map((item) => (
            <MentosCard
              key={item.mentosSeq}
              mentosSeq={item.mentosSeq}
              title={item.title}
              price={item.price}
              location={item.location}
              status={item.status}
            />
          ))}
        </section>
      </section>
    </div>
  );
}
