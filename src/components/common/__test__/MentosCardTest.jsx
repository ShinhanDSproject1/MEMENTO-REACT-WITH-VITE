// App.js 또는 부모 컴포넌트
import MentosCard from "@/components/common/MentosCard";

const MentosCardTest = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-8 md:grid-cols-3">
      <MentosCard
        title="React 강의"
        price={100000}
        location="온라인"
        imageUrl="https://picsum.photos/seed/react/200/300"
        status="completed" // 진행 완료 상태
      />
      <MentosCard
        title="디자인 포트폴리오"
        price={50000}
        location="오프라인"
        imageUrl="https://picsum.photos/seed/design/200/300"
        status="inProgress" // 진행 중 상태
      />
      <MentosCard
        title="UX/UI 멘토링"
        price={100000}
        location="온라인"
        imageUrl="https://picsum.photos/seed/uxui/200/300"
        status="pending" // 진행 전 상태
      />
      <MentosCard
        title="UX/UI 멘토링"
        price={100000}
        location="온라인"
        imageUrl="https://picsum.photos/seed/uxui/200/300"
        //멘토스 리스트는 상태 생략
      />
      <MentosCard
        title="UX/UI 멘토링"
        price={100000}
        location="온라인"
        imageUrl="https://picsum.photos/seed/uxui/200/300"
        status="mento" // 본인 멘토링
      />
    </div>
  );
};

export default MentosCardTest;
