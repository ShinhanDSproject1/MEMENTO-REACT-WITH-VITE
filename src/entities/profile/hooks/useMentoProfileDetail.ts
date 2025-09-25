import { getMentoProfileDetail } from "@entities/profile";
import { useQuery } from "@tanstack/react-query";

export const MENTO_PROFILE_DETAIL_QK = ["mento-profile-detail"] as const;

export function useMentoProfileDetail() {
  return useQuery({
    queryKey: MENTO_PROFILE_DETAIL_QK,
    queryFn: getMentoProfileDetail,
    staleTime: 60_000,
    refetchOnMount: "always",
  });
}
