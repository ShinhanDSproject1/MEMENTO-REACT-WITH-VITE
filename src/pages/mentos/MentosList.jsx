import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import MentosMainTitleComponent from "@/components/mentos/MentosMainTitleComponent";
import MentosCard from "@/components/common/MentosCard";

function MentosList(props) {
  const { category } = useParams();
  const [mainTitle, setMainTitle] = useState("");

  useEffect(() => {
    switch (category) {
      case "consumption":
        setMainTitle("소비패턴 멘토링");
        break;
      case "tips":
        setMainTitle("생활노하우 멘토링");
        break;
      case "saving":
        setMainTitle("저축방식 멘토링");
        break;
      case "growth":
        setMainTitle("자산증식 멘토링");
        break;
      default:
        // category 값이 없을 경우 빈 문자열로 설정
        setMainTitle("");
    }
  }, [category]); // 렌더링이 아니라, category 값이 변경될 때만 실행됩니다.

  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5">
        <MentosMainTitleComponent mainTitle={mainTitle} />
        <section className="flex w-full flex-col items-center space-y-4 overflow-x-hidden bg-white px-4 py-5">
          <MentosCard mentosSeq={1} title="React 강의" price={50000} location="연남동" />
          <MentosCard mentosSeq={1} title="React 강의" price={50000} location="연남동" />
          <MentosCard mentosSeq={1} title="React 강의" price={50000} location="연남동" />
          <MentosCard mentosSeq={1} title="React 강의" price={50000} location="연남동" />
        </section>
      </section>
    </div>
  );
}

MentosList.propTypes = { category: PropTypes.number };

export default MentosList;
