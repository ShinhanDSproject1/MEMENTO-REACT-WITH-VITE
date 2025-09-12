import type { MentosCategory } from "@entities/mentos";
import { getMentosList } from "@entities/mentos";
import { useQuery } from "@tanstack/react-query";
import { mentosKeys } from "../model/queryKeys";

export function useMentosListQuery(category?: MentosCategory) {
  return useQuery({
    queryKey: mentosKeys.list(category),
    queryFn: () =>
      category
        ? getMentosList({ category, page: 1, size: 5 })
        : Promise.resolve({ items: [], total: 0, page: 1, size: 5 }),
    enabled: !!category, // 카테고리 있을 때만 호출
  });
}
