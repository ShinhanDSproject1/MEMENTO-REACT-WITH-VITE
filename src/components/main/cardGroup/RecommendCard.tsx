// components/RecommendationCarousel.tsx
import { useCallback, useEffect, useMemo, useState } from "react";

type ArrowDir = "left" | "right";

interface ArrowButtonProps {
  dir?: ArrowDir;
  onClick?: () => void;
}
function ArrowButton({ dir = "left", onClick }: ArrowButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "left" ? "이전" : "다음"}
      className="grid h-8 w-8 place-items-center rounded-full border border-slate-300 bg-white/70 shadow-sm backdrop-blur hover:bg-white"
    >
      <span className="text-slate-500">{dir === "left" ? "‹" : "›"}</span>
    </button>
  );
}

interface PriceProps {
  value: number;
}
function Price({ value }: PriceProps) {
  return (
    <div className="mt-1 font-bold tracking-tight">
      ₩ {value.toLocaleString()}
    </div>
  );
}

export interface RecommendItem {
  title: string;
  mentor: string;
  price: number;
  image?: string;
  avatar?: string;
}

export interface RecommendCardProps {
  title?: string;
  items?: RecommendItem[];
  onViewAll?: () => void;
  onRefresh?: () => void;
}

export default function RecommendCard({
  title = "AI 추천 멘토링 클래스",
  items = [],
  onViewAll,
  onRefresh,
}: RecommendCardProps) {
  const fallback: RecommendItem[] = [
    {
      title: "집에 가고싶다",
      mentor: "안가연",
      price: 1_000_000,
      image: "../src/assets/images/dummy/mentoring1.jpeg",
      avatar: "../src/assets/images/character-Kogiri.svg",
    },
    {
      title: "성취란 무엇인가",
      mentor: "김정은",
      price: 20_000,
      image: "../src/assets/images/dummy/mentoring2.jpeg",
      avatar: "../src/assets/images/character-Kogiri.svg",
    },
    {
      title: "내가 바로 최다희",
      mentor: "최다희",
      price: 50_000,
      image: "../src/assets/images/dummy/mentoring3.jpeg",
      avatar: "../src/assets/images/character-Kogiri.svg",
    },
  ];

  const data = items && items.length >= 3 ? items : fallback;
  const count = data.length;

  const [idx, setIdx] = useState<number>(0); // 현재 중앙 카드 인덱스

  const go = useCallback(
    (dir: number) => setIdx((i) => (i + dir + count) % count),
    [count]
  );
  const prev = useCallback(() => go(-1), [go]);
  const next = useCallback(() => go(+1), [go]);

  // 키보드 좌우 화살표 지원
  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [prev, next]);

  // 카드 레이아웃 계산
  const cardStates = useMemo(() => {
    if (count === 0)
      return [] as { pos: "left" | "center" | "right"; i: number }[];
    const left = (idx - 1 + count) % count;
    const center = idx;
    const right = (idx + 1) % count;
    return [
      { pos: "left" as const, i: left },
      { pos: "center" as const, i: center },
      { pos: "right" as const, i: right },
    ];
  }, [idx, count]);

  return (
    <section className="relative mx-auto mt-3 w-85 rounded-3xl border-3 border-[#E5E7ED] bg-white pt-4 pb-4">
      <h3 className="[font-WooridaumB] text-center text-sm font-extrabold text-slate-500 underline">
        {title}
      </h3>

      {/* 카드 무대 */}
      <div className="relative mx-auto h-100 w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 -z-10 rounded-3xl ring-1 ring-slate-200 ring-inset" />
        <div className="- relative mx-auto h-full w-full">
          {cardStates.map(({ pos, i }) => {
            const item = data[i];
            if (!item) return null;

            // 위치/스케일/투명도/블러 등 스타일
            const base =
              "absolute top-1/2 -translate-y-1/2 transition-all duration-300 will-change-transform";
            const common =
              "w-[200px] min-h-[360px] rounded-[28px] border border-transparent bg-white ";
            let x = "50%";
            let dx = "-50%";
            let scale = "scale-100";
            let z = "z-20";
            let opacity = "opacity-100";
            let ring =
              "ring-2 ring-[#E5E7ED] hover:border-[#005EF9] hover:ring-[#005EF9]";

            if (pos === "left") {
              x = "30%";
              dx = "-50%";
              scale = "scale-[0.9]";
              z = "z-10";
              opacity = "opacity-70";
              ring = "ring-1 ring-slate-200";
            }
            if (pos === "right") {
              x = "65%";
              dx = "-50%";
              scale = "scale-[0.9]";
              z = "z-10";
              opacity = "opacity-70";
              ring = "ring-1 ring-slate-200";
            }

            return (
              <article
                key={`${pos}-${i}`}
                className={[
                  base,
                  common,
                  ring,
                  scale,
                  z,
                  opacity,
                  "ring-offset-0",
                ].join(" ")}
                style={{ left: x, transform: `translateX(${dx})` }}
              >
                {/* 상단 썸네일 영역 */}
                <div className="relative h-55 w-full overflow-hidden rounded-t-[28px] bg-slate-100">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-slate-100 to-slate-200" />
                  )}
                </div>

                {/* 아바타 */}
                <div className="relative -mt-10 flex w-full justify-center">
                  {item.avatar && (
                    <img
                      src={item.avatar}
                      alt={item.mentor}
                      className="h-16 w-16 rounded-full border-4 border-[#E5E7ED] bg-white"
                    />
                  )}
                </div>

                {/* 본문 */}
                <div className="px-5 pt-3 pb-5 text-center">
                  <h4 className="line-clamp-2 bg-slate-50 text-base font-extrabold">
                    {item.title}
                  </h4>
                  <div className="font-WooridaumB mt-3 text-xs font-extrabold tracking-wide text-[#00BBA8]">
                    {item.mentor?.toUpperCase?.()
                      ? item.mentor.toUpperCase()
                      : item.mentor}
                  </div>
                  <div className="bg-white">
                    <Price value={item.price ?? 0} />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 컨트롤 */}
      <div className="mt-4 items-center">
        <div className="flex w-full items-center justify-center gap-7">
          <ArrowButton dir="left" onClick={prev} />
          <button
            type="button"
            onClick={onViewAll}
            className="[font-WooridaumB] text-sm font-extrabold text-slate-500 underline-offset-4 hover:underline"
          >
            전체 보기
          </button>
          <ArrowButton dir="right" onClick={next} />
        </div>

        {/* 다시하기 */}
        <img
          src="../src/assets/icons/again-icon.svg"
          onClick={onRefresh}
          alt="refresh"
          className="mr-2 ml-auto h-7 w-7 cursor-pointer"
        />
      </div>
    </section>
  );
}
