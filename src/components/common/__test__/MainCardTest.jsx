import React from "react";
import MainCard from "../MainCard";

function MainCardTest() {
  return (
    <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-3">
      <MainCard
        title="공지사항"
        context={`멘토링 신청, 재테크 유형, 서비스 점검 등
안내사항을 확인하세요.`}
      />
      <MainCard
        title="FAQ"
        context={`결제취소, 환불, 문의 등 주요 질문과 답변을 
살펴보세요.`}
      />
    </div>
  );
}

export default MainCardTest;
