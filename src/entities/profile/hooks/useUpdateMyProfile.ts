import type { UpdateProfileInput, UpdateProfileSuccess } from "@entities/profile";
import { updateMyProfile } from "@entities/profile";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileQueryKeys } from "../model/queryKeys";

export function useUpdateMyProfile() {
  const qc = useQueryClient();

  return useMutation<UpdateProfileSuccess, unknown, UpdateProfileInput>({
    mutationFn: updateMyProfile,
    onSuccess: () => {
      // 서버 저장 성공 시, 내 프로필 쿼리만 새로고침
      qc.invalidateQueries({ queryKey: profileQueryKeys.me() });
    },
  });
}
