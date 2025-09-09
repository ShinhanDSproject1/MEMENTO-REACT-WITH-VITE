// src/pages/Review.tsx
import PageContainer from "@/components/profile/PageContainer";
import ReviewCard from "@/components/profile/ReviewCard";
import { useEffect, useRef, useState } from "react";

type ReviewItem = {
  id: number;
  title: string;
  date: string; // ISO or YYYY-MM-DD
  rating: number; // 1~5
  name: string;
  content: string;
};

type PageResult = {
  list: ReviewItem[];
  last: boolean;
};

export default function Review() {
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  async function fetchPage(p: number): Promise<PageResult> {
    const MOCK_DATA: ReviewItem[] = [
      {
        id: 1,
        title: "[홍대] 하루에 100만원 버는 법",
        date: "2025-08-01",
        rating: 1,
        name: "김**",
        content: "아 100만원 개꿀~",
      },
      {
        id: 2,
        title: "[홍대] 에라모르겠다 조퇴나하자",
        date: "2025-08-01",
        rating: 2,
        name: "김**",
        content: "SQLD시험쳐야하는데 시간은없고 피곤하고 에라이 포기해야징!!!",
      },
      {
        id: 3,
        title: "[홍대] 안가연, 왜 늦었는가 그것이 궁금하다",
        date: "2025-08-01",
        rating: 3,
        name: "안**",
        content: "궁금하다",
      },
      {
        id: 4,
        title: "[홍대] 하루에 100만원 버는 법",
        date: "2025-08-01",
        rating: 4,
        name: "김**",
        content: "아 100만원 개꿀~",
      },
      {
        id: 5,
        title: "[홍대] 에라모르겠다 조퇴나하자",
        date: "2025-08-01",
        rating: 5,
        name: "김**",
        content: "SQLD시험쳐야하는데 시간은없고 피곤하고 에라이 포기해야징!!!",
      },
      {
        id: 6,
        title: "[홍대] 안가연, 왜 늦었는가 그것이 궁금하다",
        date: "2025-08-01",
        rating: 3,
        name: "안**",
        content: "궁금하다",
      },
    ];

    // 데모: 첫 페이지만 데이터, 이후엔 last = true
    if (p > 0) return { list: [], last: true };
    return { list: MOCK_DATA, last: true };
  }

  // 페이지 로드
  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const { list, last } = await fetchPage(page);
        if (!cancelled) {
          setItems((prev) => [...prev, ...list]);
          setHasMore(!last);
        }
      } catch {
        if (!cancelled) setError("리뷰를 불러오지 못했습니다.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [page]);

  // 무한 스크롤
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setPage((p) => p + 1);
        }
      },
      { rootMargin: "200px", threshold: 0.01 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading]);

  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5">
        <h1 className="font-WooridaumB mt-6 mb-15 pl-2 text-[20px] font-bold">
          리뷰 확인하기
        </h1>

        <PageContainer className="space-y-4">
          {items.map((it) => (
            <ReviewCard
              key={it.id}
              title={it.title}
              date={it.date}
              rating={it.rating}
              name={it.name}
              content={it.content}
              className="w-full"
            />
          ))}

          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center text-sm text-gray-500">
              불러오는 중…
            </div>
          )}

          {!hasMore && !loading && items.length > 0 && (
            <div className="text-center text-xs text-gray-400">
              마지막 페이지입니다
            </div>
          )}

          <div ref={sentinelRef} />
        </PageContainer>
      </section>
    </div>
  );
}
