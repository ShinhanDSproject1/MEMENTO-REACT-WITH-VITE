import { getMentosList } from "@entities/mentos";
import type { GetMentosListResponse } from "@entities/mentos/model/types";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useMentosInfiniteList(categoryId: number, limit = 5) {
  return useInfiniteQuery<GetMentosListResponse>({
    queryKey: ["mentos", "infinite", categoryId, limit],
    queryFn: ({ pageParam }) =>
      getMentosList({ categoryId, limit, cursor: pageParam as string | undefined }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      const mentos = lastPage.result.mentos;
      if (!lastPage.result.hasNext || mentos.length === 0) return undefined;
      return String(mentos[mentos.length - 1].mentosSeq); // 마지막 mentosSeq을 cursor로 사용
    },
  });
}
