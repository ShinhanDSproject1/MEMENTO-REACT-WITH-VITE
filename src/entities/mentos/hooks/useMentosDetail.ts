import { useQuery } from "@tanstack/react-query";
import { getMentosDetail } from "../api/getMentosDetail";
import type { MentosDetailResult } from "../model/types";

export function useMentosDetail(
  mentosSeq?: number,
  opts?: { enabled?: boolean; public?: boolean },
) {
  return useQuery<MentosDetailResult, Error>({
    queryKey: ["mentosDetail", mentosSeq, opts?.public ?? false],
    queryFn: () => getMentosDetail(mentosSeq!, { public: opts?.public }),
    enabled: !!mentosSeq && (opts?.enabled ?? true),
  });
}
