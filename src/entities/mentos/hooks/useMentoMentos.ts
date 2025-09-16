import type { MentorMentosListResult } from "@entities/mentos";
import { getMentoMentos } from "@entities/mentos";
import { useInfiniteQuery } from "@tanstack/react-query";

export function useMentoMentos(limit = 5) {
  return useInfiniteQuery<
    MentorMentosListResult,
    Error,
    MentorMentosListResult,
    ["mentoMentos", number],
    number | undefined
  >({
    queryKey: ["mentoMentos", limit],
    initialPageParam: undefined,
    queryFn: ({ pageParam }) => getMentoMentos(limit, pageParam),
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.nextCursor : undefined),
  });
}
