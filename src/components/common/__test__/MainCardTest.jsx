import React from "react";
import PropTypes from "prop-types";
import MainCard from "../MainCard";

function MainCardTest(props) {
  return (
    <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-3">
      <MainCard
        title="공지사항"
        context={`멘토링 신청, 재테크 유형, 서비스 점검 등
안내사항을 확인하세요.`}
      />
    </div>
  );
}

MainCardTest.propTypes = {};

export default MainCardTest;
