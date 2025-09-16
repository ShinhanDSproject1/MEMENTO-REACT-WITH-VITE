import {
  createMentos,
  type CreateMentosRequest,
  type CreateMentosResponse,
} from "@entities/mentos";
import { useMutation } from "@tanstack/react-query";

export function useCreateMentos() {
  return useMutation<CreateMentosResponse, unknown, CreateMentosRequest>({
    mutationFn: createMentos,
  });
}
