export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 bg-slate-50">
      <section className="mx-auto flex max-w-6xl flex-col px-4 py-8 sm:px-6">
        {/* 고객센터 + 회사 정보를 세로 배치 */}
        <div className="flex flex-col gap-6">
          {/* 고객센터 */}
          <div>
            <h3 className="font-WooridaumB mb-1 text-left text-lg text-[#768297]">
              신한DS SW아카데미 고객센터
            </h3>
            <div className="font-WooridaumB text-left text-2xl font-semibold text-[#768297]">
              02-6392-0044
            </div>
            <p className="mt-2 text-left text-sm leading-6 text-[#768297]">
              평일 <span className="text-sm tabular-nums">AM10:00</span> –{" "}
              <span className="tabular-nums">PM05:00</span>
              <br />
              점심 <span className="tabular-nums">PM12:00</span> –{" "}
              <span className="tabular-nums">PM01:00</span>
            </p>
          </div>

          {/* 회사 정보: 고객센터 밑으로 이동 */}
          <div className="text-sm leading-6 text-[#768297]">
            <div className="flex gap-3">
              <span className="font-WooridaumB w-16 shrink-0 text-[#201f1f]">프로젝트명 </span>
              <span className="font-WooridaumB text-[#768297]">메멘토</span>
            </div>
            <div className="flex gap-3">
              <span className="font-WooridaumB w-16 shrink-1 text-[#201f1f]">팀원 </span>
              <span className="font-WooridaumB mt-1 shrink-2 text-xs text-[#768297]">
                김기도/김대현/김정은/조상호/안가연/최다희
              </span>
            </div>
            <div className="flex gap-3">
              <span className="font-WooridaumB w-16 shrink-0 text-[#201f1f]">주소</span>
              <span className="font-WooridaumB text-[#768297]">
                서울 마포구 월드컵북로 4길 77 1층
              </span>
            </div>
          </div>
        </div>

        {/* 하단: 저작권/고지 */}
        <div className="mt-8 space-y-1 text-left">
          <p className="font-WooridaumB text-sm text-[#768297]">
            메멘토는 <span className="font-WooridaumB font-sm">신한DS SW아카데미</span>에서 <br />
            교육생들이 운영하는 프로젝트입니다.
          </p>
          <p className="font-WooridaumB mt-5 text-sm text-[#768297]">
            ©2025 <span className="font-WooridaumB font-medium">MeMento</span> All Rights Reserved.
          </p>
        </div>
      </section>
    </footer>
  );
}
