import { type GetMyMentosResponse, getMyMentos } from "@entities/mentos";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useMyMentosInfinite(limit = 5) {
  return useInfiniteQuery<GetMyMentosResponse>({
    queryKey: ["my-mentos", limit],
    queryFn: ({ pageParam }) => getMyMentos(limit, pageParam as number | undefined),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) =>
      lastPage.result.hasNext ? lastPage.result.nextCursor : undefined,
  });
}
