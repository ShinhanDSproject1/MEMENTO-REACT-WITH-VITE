import { type GetMentosListResponse, getMentosList, mentosKeys } from "@entities/mentos";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useMentosListQuery(categoryId?: number, limit = 5, cursor?: string) {
  return useQuery<GetMentosListResponse>({
    queryKey: mentosKeys.list(categoryId, limit),
    queryFn: () => getMentosList({ categoryId: categoryId!, limit, cursor }),
    enabled: !!categoryId,
    placeholderData: keepPreviousData,
  });
}
