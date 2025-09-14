// src/features/booking/create-reservation/model/useCreateReservation.ts
import { type BookingRequest, type BookingResponse, createReservation } from "@entities/booking";
import { useMutation } from "@tanstack/react-query";

export default function useCreateReservation() {
  return useMutation<BookingResponse, Error, BookingRequest>({
    mutationFn: (req) => createReservation(req),
  });
}
