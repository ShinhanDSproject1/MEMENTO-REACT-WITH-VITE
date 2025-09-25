import type { GetProfile, GetProfileSuccess, MentoProfile } from "@entities/profile";
import { getMyProfile, profileQueryKeys } from "@entities/profile";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export function isMento(p: GetProfile): p is MentoProfile {
  return p.memberType === "MENTO";
}

/**
 * 내 프로필 조회 훅
 * - API 래퍼(GetProfileSuccess)에서 result만 뽑아 Profile로 반환
 * - QueryProvider가 전역에 있으므로 그대로 사용 가능
 */
export function useMyProfile(
  options?: Omit<
    UseQueryOptions<GetProfileSuccess, unknown, GetProfile, ReturnType<typeof profileQueryKeys.me>>,
    "queryKey" | "queryFn" | "select"
  >,
) {
  return useQuery({
    queryKey: profileQueryKeys.me(),
    queryFn: getMyProfile,
    select: (d) => d.result,
    staleTime: 60_000, // 1분 캐시
    refetchOnWindowFocus: false,
    ...options,
  });
}
