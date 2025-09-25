export type SlotsByDate = Record<string, string[]>;
export interface BookingRequest {
  mentosSeq: number;
  memberSeq: number;
  date: string;
  time: string;
}
export interface BookingResponse {
  reservationId: string;
}
