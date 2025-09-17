// src/features/mentos-my/hooks/useMyMentosInfinite.ts
import { type GetMyMentosResponse, getMyMentos } from "@entities/mentos";
import { useInfiniteQuery } from "@tanstack/react-query";

type Opts = { enabled?: boolean };

export function useMyMentosInfiniteList(limit = 5, opts: Opts = {}) {
  const { enabled = true } = opts;
  return useInfiniteQuery<GetMyMentosResponse>({
    queryKey: ["my-mentos", limit],
    queryFn: ({ pageParam }) => getMyMentos(limit, pageParam as number | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.result.hasNext ? lastPage.result.nextCursor : undefined,
    enabled, // 🔹 역할에 따라 off 가능
  });
}
