import type { UpdatePasswordInput, UpdatePasswordSuccess } from "@entities/profile";
import { updateMyPassword } from "@entities/profile";
import { useMutation } from "@tanstack/react-query";

export function useUpdateMyPassword() {
  return useMutation<UpdatePasswordSuccess, unknown, UpdatePasswordInput>({
    mutationFn: updateMyPassword,
  });
}
