// src/pages/Review.tsx
import PageContainer from "@/widgets/profile/PageContainer";
import ReviewCard from "@/widgets/profile/ReviewCard";
import { getMentoReviews, type MentorReview } from "@entities/review";
import { useCallback, useEffect, useRef, useState } from "react";

type UiReviewItem = {
  id: number;
  title: string;
  date: string;
  rating: number;
  name: string;
  content: string;
};

export default function Review() {
  const [items, setItems] = useState<UiReviewItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const [error, setError] = useState("");
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // 최신 상태 추적용 ref
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);
  const cursorRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);
  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);
  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  const mapToUi = (r: MentorReview): UiReviewItem => ({
    id: r.reviewSeq,
    title: r.mentosTitle,
    date: r.createdAt,
    rating: r.reviewRating,
    name: r.mentiName,
    content: r.reviewContent,
  });

  // 무한 스크롤에서만 사용하는 fetchMore
  const fetchMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) return;
    if (error) return; // 🚨 에러 상태에서는 재요청 막기

    try {
      setLoading(true);
      setError("");

      const res = await getMentoReviews(10, cursorRef.current);
      const mapped = res.reviews.map(mapToUi);

      setItems((prev) => {
        const seen = new Set(prev.map((p) => p.id));
        const next = [...prev];
        for (const it of mapped) {
          if (!seen.has(it.id)) {
            next.push(it);
          }
        }
        return next;
      });

      setHasMore(res.hasNext);
      setCursor(res.nextCursor ?? undefined);
    } catch (err: any) {
      // ✅ 서버 응답 메시지 반영
      const msg = err?.response?.data?.message || err?.message || "리뷰를 불러오지 못했습니다.";
      setError(msg);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [error]); // error 의존 추가

  // 초기 로드 (한번만 실행)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getMentoReviews(10, undefined);
        if (cancelled) return;
        setItems(res.reviews.map(mapToUi));
        setHasMore(res.hasNext);
        setCursor(res.nextCursor ?? undefined);
      } catch (err: any) {
        if (!cancelled) {
          // ✅ 서버 응답 메시지 반영
          const msg = err?.response?.data?.message || err?.message || "리뷰를 불러오지 못했습니다.";
          setError(msg);
          setHasMore(false);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // 무한 스크롤 옵저버
  useEffect(() => {
    if (!hasMore || loading) return;
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          fetchMore();
        }
      },
      { rootMargin: "200px", threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [hasMore, loading, fetchMore]);

  return (
    <div className="flex min-h-screen w-full justify-center bg-[#f5f6f8]">
      <section className="w-full bg-white px-4 py-5">
        <h1 className="font-WooridaumB mb-6 text-[20px] font-bold">리뷰 확인하기</h1>

        <PageContainer className="space-y-4">
          {error && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {items.map((it) => (
            <ReviewCard
              key={it.id}
              title={it.title}
              date={it.date}
              rating={it.rating}
              name={it.name}
              content={it.content}
            />
          ))}

          {!loading && !error && items.length === 0 && (
            <div className="text-center text-sm text-gray-500">표시할 리뷰가 없습니다.</div>
          )}

          {loading && <div className="text-center text-sm text-gray-500">불러오는 중…</div>}
          {!hasMore && !loading && items.length > 0 && (
            <div className="text-center text-xs text-gray-400">마지막 페이지입니다</div>
          )}

          <div ref={sentinelRef} />
        </PageContainer>
      </section>
    </div>
  );
}
