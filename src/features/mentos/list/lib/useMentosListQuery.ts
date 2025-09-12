import { getMentosList } from "@entities/mentos";
import type { GetMentosListResponse } from "@entities/mentos/model/types";
import { useQuery } from "@tanstack/react-query";
import { mentosKeys } from "../model/queryKeys";

export function useMentosListQuery(categoryId?: number, limit = 5, cursor?: number) {
  return useQuery<GetMentosListResponse>({
    queryKey: mentosKeys.list(categoryId, limit, cursor),
    queryFn: () =>
      categoryId
        ? getMentosList({ categoryId, limit, cursor })
        : Promise.resolve({
            code: 200,
            message: "빈 카테고리",
            result: { mentos: [], hasNext: false },
          }),
    enabled: !!categoryId, // categoryId가 있을 때만 실행
  });
}
