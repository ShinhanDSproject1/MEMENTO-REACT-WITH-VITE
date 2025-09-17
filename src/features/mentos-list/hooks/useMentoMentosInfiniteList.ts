// src/features/mentos-list/hooks/useMentoMentosInfiniteList.ts
import type { MentorMentosListResult } from "@entities/mentos";
import { getMentoMentos } from "@entities/mentos";
import { useInfiniteQuery, type InfiniteData } from "@tanstack/react-query";

type Opts = { enabled?: boolean };

export function useMentoMentosInfiniteList(limit = 5, opts: Opts = {}) {
  const { enabled = true } = opts;
  return useInfiniteQuery<
    MentorMentosListResult,
    Error,
    InfiniteData<MentorMentosListResult>,
    [string, number],
    number | undefined
  >({
    queryKey: ["mentoMentos", limit],
    initialPageParam: undefined,
    queryFn: async ({ pageParam }) => getMentoMentos(limit, pageParam),
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
    enabled, // 🔹 역할에 따라 off 가능
  });
}
