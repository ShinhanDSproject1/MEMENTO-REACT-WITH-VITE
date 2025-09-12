// src/pages/mentos/MentosList.tsx
import MentosCard from "@/widgets/common/MentosCard";
import MentosMainTitleComponent from "@/widgets/mentos/MentosMainTitleComponent";
import { useMentosListQuery } from "@features/mentos";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

// 카테고리 슬러그 → 타이틀
const TITLE_MAP: Record<string, string> = {
  consumption: "소비패턴 멘토링",
  tips: "생활노하우 멘토링",
  saving: "저축방식 멘토링",
  growth: "자산증식 멘토링",
};

// 카테고리 슬러그 → 서버 categoryId (임시 매핑: 백엔드와 맞춰서 조정)
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

  // 페이지네이션 파라미터 (초기)
  const LIMIT = 5;
  const CURSOR = undefined; // 무한 스크롤 도입 시 상태로 관리

  const { data, isLoading, isError, refetch } = useMentosListQuery(categoryId, LIMIT, CURSOR);

  const list = data?.result?.mentos ?? [];
  const empty = !isLoading && !isError && list.length === 0;

  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5">
        <MentosMainTitleComponent mainTitle={mainTitle} />

        {/* 로딩 */}
        {isLoading && (
          <div className="py-10 text-center text-sm text-gray-500">목록을 불러오는 중…</div>
        )}

        {/* 에러 */}
        {isError && (
          <div className="flex items-center justify-center gap-3 py-10 text-sm">
            <span className="text-red-500">목록을 불러오지 못했습니다.</span>
            <button onClick={() => refetch()} className="rounded bg-blue-600 px-3 py-1 text-white">
              다시 시도
            </button>
          </div>
        )}

        {/* 비어있음 */}
        {empty && (
          <div className="py-10 text-center text-sm text-gray-500">표시할 멘토링이 없어요.</div>
        )}

        {/* 목록 */}
        <section className="flex w-full flex-col items-center space-y-4 overflow-x-hidden bg-white px-4 py-5">
          {list.map((item) => (
            <MentosCard
              key={item.mentosSeq}
              mentosSeq={item.mentosSeq}
              title={item.mentosTitle}
              price={item.mentosPrice}
              location={item.region}
              // approved 여부로 임시 상태 매핑 (컴포넌트 요구사항에 맞게 조정 가능)
              status={item.approved ? "completed" : "pending"}
              // 썸네일 필요하면 props 추가해서 전달
              // thumbnail={item.mentosImg}
            />
          ))}
        </section>
      </section>
    </div>
  );
}
