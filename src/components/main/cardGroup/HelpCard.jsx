import PropTypes from "prop-types";
import { Link } from "react-router-dom";

export default function HelpCard() {
  return (
    <div>
      <section className="mx-auto mt-10 max-w-2xl px-4 py-6">
        <div className="space-y-4 text-left">
          <h2 className="font-WooridaumB mb-4 ml-2 text-left font-semibold text-[#757575]">
            도움이 필요 하신가요?
          </h2>
          <Link
            to="ready"
            className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-WooridaumB text-base font-semibold text-slate-900">공지사항</h3>
                <p className="font-WooridaumB mt-1 text-sm text-slate-500">
                  멘토링 신청, 제테크 유형, 서비스 점검 등 안내사항을 확인하세요.
                </p>
              </div>
              <button className="font-WooridaumB shrink-0 cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:ring-2 focus:ring-slate-300 focus:outline-none">
                바로가기
              </button>
            </div>
          </Link>
          <Link
            to="ready"
            className="block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="font-WooridaumB text-base font-semibold text-slate-900">FAQ</h3>
                <p className="font-WooridaumB mt-1 text-sm text-slate-500">
                  결제취소, 환불, 문의 등 주요 질문과 답변을 살펴보세요.
                </p>
              </div>
              <button className="font-WooridaumB shrink-0 cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200 focus:ring-2 focus:ring-slate-300 focus:outline-none">
                바로가기
              </button>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}

HelpCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  link: PropTypes.string,
};
