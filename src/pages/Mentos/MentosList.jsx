import React, { useState } from "react";
import PropTypes from "prop-types";
import MentosMainTitleComponent from "@/components/mentos/MentosMainTitleComponent";
import MainHeader from "@/components/MainHeader";
import MentosCard from "@/components/common/MentosCard";

function MentosList(category, props) {
  const [mainTitle, setMainTitle] = useState("");

  switch (category) {
    case 1:
      setMainTitle("소비패턴 멘토링");
      break;
    case 2:
      setMainTitle("생활노하우 멘토링");
      break;
    case 3:
      setMainTitle("저축방식 멘토링");
      break;
    case 4:
      setMainTitle("자산증식 멘토링");
      break;

    default:
      null;
  }

  return (
    <div className="flex h-full w-full min-w-[375px] flex-col overflow-y-scroll bg-white pb-4">
      <MainHeader />
      <MentosMainTitleComponent mainTitle={mainTitle} />
      <section className="flex w-full flex-col items-center justify-center gap-3">
        <MentosCard title="React 강의" price={50000} location="연남동" status="" />
        <MentosCard title="React 강의" price={50000} location="연남동" />
        <MentosCard title="React 강의" price={50000} location="연남동" />
        <MentosCard title="React 강의" price={50000} location="연남동" />
      </section>
    </div>
  );
}

MentosList.propTypes = { category: PropTypes.number };

export default MentosList;
