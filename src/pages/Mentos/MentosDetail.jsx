import PropTypes from "prop-types";
import ReviewMentosDetailCard from "@/components/mentos/ReviewMentosDetailCard";
import locationIcon from "@/assets/icons/location-icon.svg";
import clockIcon from "@/assets/icons/clock-icon.svg";
import { useParams, useNavigate } from "react-router-dom";
import starIcon from "@/assets/icons/star-icon.svg";
import mapDummyimg from "@/assets/images/mapdummyimg.svg";
import kogiri from "@/assets/images/character-kogiri.svg";
import Button from "@/components/common/Button";
import SnapCarousel from "@/components/common/SnapCarousel";

function MentosDetail(props) {
  const navigate = useNavigate();
  const { id } = useParams();

  const mentosSeq = useParams();
  const title = "[홍대] 하루에 100만원 벌고 부자되는 비법 공유!!!";
  const exReviews = 2000;
  const reviewCount = exReviews.toLocaleString();

  const exPrice = 8000;
  const priceText = exPrice.toLocaleString();

  const handleGoBooking = () => {
    navigate("/booking", {
      state: {
        mentorId: Number(id) || 1, // 적절히 세팅
        title,
        price: exPrice,
      },
    });
  };

  return (
    <div className="flex w-full flex-col gap-2 bg-white">
      <section className="flex h-[20%] w-full items-center justify-center">
        <img className="w-full" src="https://picsum.photos/id/1/300/200" alt="mentos image" />
      </section>
      <section className="flex w-full flex-col gap-2 px-4">
        <p className="font-WooridaumB text-[0.85rem] font-bold">
          [홍대] 하루에 100만원 벌고 부자되는 비법 공유!!!
        </p>
        <div className="flex flex-row items-center gap-1.5 text-sm">
          <img src={locationIcon} />
          <span className="font-WooridaumB text-[0.6rem] leading-3">마포구 연남동</span>
        </div>
        <div className="flex h-full items-center justify-between">
          <div className="flex w-auto flex-row items-center gap-1.5 text-sm">
            <img src={clockIcon} />
            <span className="font-WooridaumB text-[0.6rem] leading-3">총 1시간</span>
          </div>
          <div className="flex h-full items-center">
            <div className="flex gap-1">
              <img
                className="inline-block h-[0.6rem] w-[0.6rem] align-middle"
                src={starIcon}
                alt="star"
              />
              <span className="font-WooridaumB text-[0.6rem] leading-3 font-bold text-gray-900">
                4.95
              </span>
            </div>
            <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
            <span className="font-WooridaumB text-[0.6rem] leading-3 font-medium text-gray-900 underline">
              {reviewCount}건 리뷰
            </span>
          </div>
        </div>
      </section>
      <SnapCarousel className="flex w-full pt-6">
        <div className="snap-item w-[85%] flex-none snap-center">
          <ReviewMentosDetailCard
            value={3}
            context={`안녕하세요 저는 집에안가연 입니다
                      도대체 집을 왜안가는지 모르겠습니다
                      감사합니다`}
            name="안가연"
          />
        </div>
        <div className="snap-item w-[85%] flex-none snap-center">
          <ReviewMentosDetailCard
            value={5}
            context={`안녕하세요 저는 집에안가연 입니다
                      도대체 집을 왜안가는지 모르겠습니다
                      감사합니다`}
            name="안가연"
          />
        </div>
        <div className="snap-item w-[85%] flex-none snap-center">
          <ReviewMentosDetailCard
            value={1}
            context={`안녕하세요 저는 집에안가연 입니다
                      도대체 집을 왜안가는지 모르겠습니다
                      감사합니다`}
            name="안가연"
          />
        </div>
      </SnapCarousel>

      <section className="flex h-[20%] w-full justify-center border-b-[1px] border-b-zinc-100 py-2">
        <img className="w-full" src={mapDummyimg} alt="map image" />
      </section>

      <section className="flex w-full flex-col items-center justify-center gap-4 px-4 pt-[26%]">
        <div className="relative flex w-full max-w-sm flex-col items-center justify-center rounded-[20px] bg-[#F4F4F4] p-4">
          <div className="absolute -top-[26%] flex w-full">
            <div className="relative flex w-full flex-col items-center justify-center">
              <span className="font-WooridaumB py-1 text-xl font-bold">멘토소개</span>
              <div className="z-10 h-auto w-[40%] overflow-hidden rounded-full bg-radial from-[white] via-[#E4EDFF] to-[#AEC8FF] p-1">
                <img src={kogiri} className="h-full w-full object-cover" alt="멘토 프로필" />
              </div>
              <div className="absolute -bottom-[12%] z-20 w-[40%] min-w-[150px] rounded-[10px] bg-[#0059FF] px-4 py-1 text-center">
                <span className="font-WooridaumB text-[0.85rem] font-bold whitespace-pre text-white">
                  집언제가연? 안가연
                </span>
              </div>
            </div>
          </div>

          <div className="flex pt-22 text-center">
            <span className="font-WooridaumB">
              Jelly sweet roll jelly beans biscuit pie macaroon chocolate donut. Carrot cake
              caramels pie sweet apple pie tiramisu carrot cake. Marzipan marshmallow croissant
              tootsie roll lollipop. Cupcake lemon drops bear claw gummies. Jelly bear claw gummi
              bears lollipop cotton candy gummi bears chocolate bar cake cookie. Cupcake muffin
              danish muffin cookie gummies.
            </span>
          </div>
        </div>
        <div className="flex w-full flex-col items-center justify-center px-2 pb-4 text-center text-[0.8rem]">
          <div className="flex flex-col">
            <span>금융권 취준 대외활동의 절대 강자!! </span>
            <span>
              <b>삼성</b>이 하면 다르다!
            </span>
            <span>교육의 메카 삼성에서 제공하는 프리미엄 금융교육!</span>
            전문지식과 실무경험이 함께하는 예비금융권취업(은행,증권,카드,보험)을 위한 프로그램
            전문지식 습득과 생생한 실무경험의 기회!
            <span>체계화된 교육프로그램으로 금융업의 취업비전을 한발 앞서 키우십시오.</span>
            <br />
            <span className="font-bold">■지원기간</span>
            <span>2019년 10.11(금) 15시 마감 지원방법은 아래의 구글폼 작성 후 제출해주세요</span>
            <br />
            <span className="font-bold">■교육기간</span>
            <span>
              2019. 10.14(월) ~ 10.18(금) / (총 5일)
              <br /> 매일 14시~18시
            </span>
            <br />
            <span className="font-bold">■ 교육장소</span>
            서울시 강남구 대치동, 삼성생명 대치타워 21층 (선릉역 2호선 1번 출구에서 직진 200m)
          </div>
        </div>
      </section>
      <div className="flex w-full flex-row items-center justify-center gap-4 border-t-[1px] border-t-zinc-100 p-4">
        <div className="flex-1 text-center">
          <span className="font-WooridaumB font-bold">{exPrice.toLocaleString()}원</span>
        </div>
        <Button variant="primary" size="lg" className="flex-1" onClick={handleGoBooking}>
          예약하기
        </Button>
      </div>
    </div>
  );
}

MentosDetail.propTypes = {};

export default MentosDetail;
