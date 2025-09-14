// src/features/mentos-my/hooks/useMyMentosInfinite.ts
import { type GetMyMentosResponse, getMyMentos } from "@entities/mentos";
import { useInfiniteQuery } from "@tanstack/react-query";

// 바깥에서 제어하고 싶은 옵션만 노출(지금은 enabled만)
type Opts = {
  enabled?: boolean;
};

export function useMyMentosInfinite(limit = 5, opts: Opts = {}) {
  return useInfiniteQuery<GetMyMentosResponse>({
    queryKey: ["my-mentos", limit],
    queryFn: ({ pageParam }) => getMyMentos(limit, pageParam as number | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.result.hasNext ? lastPage.result.nextCursor : undefined,
    enabled: opts.enabled, // ✅ 여기서만 씀 (…opts 제거)
  });
}
