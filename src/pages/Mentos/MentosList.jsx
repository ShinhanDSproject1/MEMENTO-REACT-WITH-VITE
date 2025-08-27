import React from "react";
import PropTypes from "prop-types";
import MentosMainTitleComponent from "@/components/mentos/MentosMainTitleComponent";
import MainHeader from "@/components/MainHeader";
import MentosCard from "@/components/common/MentosCard";

function MentosList(props) {
  return (
    <div className="flex h-full w-full min-w-[375px] flex-col overscroll-y-auto bg-white pb-4">
      <MainHeader />
      <MentosMainTitleComponent mainTitle={"멘토링 내역"} />
      <section className="flex w-full flex-col items-center justify-center gap-3">
        <MentosCard title="React 강의" price={50000} location="연남동" status="" />
        <MentosCard title="React 강의" price={50000} location="연남동" />
        <MentosCard title="React 강의" price={50000} location="연남동" />
        <MentosCard title="React 강의" price={50000} location="연남동" />
      </section>
    </div>
  );
}

MentosList.propTypes = {};

export default MentosList;
