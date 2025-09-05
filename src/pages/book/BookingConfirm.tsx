import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import BookingSummaryCard from "@/components/booking/BookingSummaryCard";
import TermsAccordion from "@/components/booking/TermsAccordion";
import TermsOfUse from "@/components/booking/term/TermsOfUse";
import PrivacyCollectTerms from "@/components/booking/term/PrivacyCollectTerms";
import PrivacyThirdPartyTerms from "@/components/booking/term/PrivacyThirdPartyTerms";

type BookingState = {
  title: string;
  date: string;
  time: string;
  price: number;
};

const weekdayKo = ["일", "월", "화", "수", "목", "금", "토"];
const formatKoreanDate = (ymd: string, time: string) => {
  const [y, m, d] = ymd.split("-").map(Number);
  const dt = new Date(y, (m ?? 1) - 1, d ?? 1);
  const w = weekdayKo[dt.getDay()];
  return `${m}.${d}(${w}) ${time}`;
};

export default function BookingConfirm() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const booking = (state || {}) as Partial<BookingState>;

  const valid =
    !!booking.date && !!booking.time && !!booking.title && typeof booking.price === "number";

  const formattedWhen = useMemo(
    () => (valid ? formatKoreanDate(booking!.date!, booking!.time!) : "-"),
    [valid, booking],
  );

  const handlePay = () => {
    alert("결제 로직 추후 연결.");
  };

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto w-full max-w-[360px] overflow-hidden rounded-2xl bg-white">
        {/* 헤더 */}
        <div className="border-b border-gray-100 px-6 py-4 text-left">
          <h1 className="font-WooridaumB text-gray-600">예약내역</h1>
        </div>

        {/* 본문 */}
        <div className="p-6">
          <p className="font-WooridaumR mb-4 text-[16px] text-[#000008]">
            선택하신 항목이 맞는지 확인해주세요.
          </p>

          <BookingSummaryCard title={booking.title ?? "-"} whenText={formattedWhen} />

          <div className="mt-2 mb-4 flex items-center justify-between">
            <span className="font-WooridaumR text-[17px] text-[#3F3E6D]">지금 결제할 금액</span>
            <span className="font-WooridaumR text-[17px] text-[#FC4C4E]">
              {typeof booking.price === "number" ? booking.price.toLocaleString() : "-"}원
            </span>
          </div>

          <TermsAccordion title="개인정보 수집, 제공" defaultOpen>
            <TermsAccordion.Item title="이용약관 동의" defaultOpen={false}>
              <TermsOfUse />
            </TermsAccordion.Item>

            <TermsAccordion.Item title="개인정보 수집 및 이용 동의">
              <PrivacyCollectTerms />
            </TermsAccordion.Item>

            <TermsAccordion.Item title="개인정보 제 3자 제공 동의">
              <PrivacyThirdPartyTerms />
            </TermsAccordion.Item>
          </TermsAccordion>

          <p className="font-WooridaumL mt-3 flex items-start gap-2 text-[12px] leading-[1.6]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="green"
              strokeWidth={2}
              className="mt-[2px] h-4 w-4 flex-none">
              <circle cx="12" cy="12" r="10" /> <path d="M7 12l3 3 7-7" />
            </svg>
            <span className="flex-1">
              예약 서비스 이용을 위한 개인정보 수집 및 제3자 제공 <br />
              규정을 확인하였으며 이에 동의합니다.
            </span>
          </p>

          {/* 버튼 */}
          <button
            onClick={handlePay}
            disabled={!valid}
            className={[
              "mt-4 mb-3 h-14 w-full rounded-2xl text-base font-extrabold text-white shadow transition active:scale-[0.99]",
              valid
                ? "cursor-pointer bg-[#1161FF] hover:bg-[#0C2D62]"
                : "cursor-not-allowed bg-[#1E90FF]/40",
              "font-WooridaumB",
            ].join(" ")}>
            결제하기
          </button>

          <button
            onClick={() => navigate(-1)}
            className="font-WooridaumB h-14 w-full rounded-2xl bg-gray-300 text-base font-extrabold text-gray-600 hover:bg-gray-400">
            취소하기
          </button>
        </div>
      </div>
    </div>
  );
}
