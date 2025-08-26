import Footer from "@/components/footer";
import HelpCard from "@/components/HelpCard";
import { InteractiveHoverButton } from "@/components/MainButton";
function Home() {
  return (
    <div className="mx-auto w-full rounded-xl bg-white">
      <p className="px-6 text-left text-xs text-[#757575]">
        당신의 소중한 제테크를 AI가 추천한 멘토와 함께하세요!
      </p>

      <img
        src="../src/assets/images/character-full.svg"
        alt="character-full"
        className="mx-auto w-80 animate-[floaty_3s_ease-in-out_infinite]"
      />

      <div className="mx-auto w-full space-y-2 bg-[#F0F4FA] pb-3 text-center">
        <p className="font-WooridaumB mb-4 pt-4 text-base text-[#23272E]">
          회원가입하고 더 많은 서비스를 이용하세요
        </p>
        <button className="mx-auto rounded-full bg-[#AEC8EF] p-2 px-6 text-sm text-white hover:bg-[#657fa79d] hover:shadow">
          로그인
        </button>
      </div>

      <div className="mt-10 flex flex-col items-center gap-y-4">
        <InteractiveHoverButton className="font-WooridaumB w-[300px] max-w-sm rounded-lg bg-[#005EF9] px-6 py-3 text-center font-bold text-white">
          소비패턴
        </InteractiveHoverButton>
        <InteractiveHoverButton className="font-WooridaumB w-[300px] max-w-sm rounded-lg bg-[#005EF9] px-6 py-3 text-center font-bold text-white">
          생활노하우
        </InteractiveHoverButton>
        <InteractiveHoverButton className="font-WooridaumB w-[300px] max-w-sm rounded-lg bg-[#005EF9] px-6 py-3 text-center font-bold text-white">
          저축방식
        </InteractiveHoverButton>
        <InteractiveHoverButton className="font-WooridaumB w-[300px] max-w-sm rounded-lg bg-[#005EF9] px-6 py-3 text-center font-bold text-white">
          자산증식
        </InteractiveHoverButton>
      </div>

      <section className="mx-auto mt-10 max-w-2xl px-4 py-6">
        <h2 className="font-WooridaumB mb-4 ml-2 text-left font-semibold text-[#757575]">
          도움이 필요 하신가요?
        </h2>

        <div className="space-y-4 text-left">
          <HelpCard
            title="공지사항"
            description="멘토링 신청, 제테크 유형, 서비스 점검 등 안내사항을 확인하세요."
            link="#notice"
          />
          <HelpCard
            title="FAQ"
            description="결제취소, 환불, 문의 등 주요 질문과 답변을 살펴보세요."
            link="#faq"
          />
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default Home;
