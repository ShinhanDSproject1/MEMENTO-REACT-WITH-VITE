// src/pages/MentosList.tsx
import MentosCard from "@/components/common/MentosCard";
import MentosMainTitleComponent from "@/components/mentos/MentosMainTitleComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

// useParams에서 받을 category 값의 타입 정의
type Category = "consumption" | "tips" | "saving" | "growth" | undefined;

export default function MentosList() {
  const { category } = useParams<{ category: Category }>();
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
        setMainTitle("");
    }
  }, [category]);

  return (
    <div className="flex min-h-screen w-full justify-center overflow-x-hidden bg-[#f5f6f8] font-sans antialiased">
      <section className="w-full overflow-x-hidden bg-white px-4 py-5">
        <MentosMainTitleComponent mainTitle={mainTitle} />
        <section className="flex w-full flex-col items-center space-y-4 overflow-x-hidden bg-white px-4 py-5">
          <MentosCard
            mentosSeq={1}
            title="React 강의"
            price={50000}
            location="연남동"
            status="completed"
          />
          <MentosCard
            mentosSeq={2}
            title="Spring Boot 강의"
            price={70000}
            location="홍대"
            status="completed"
          />
          <MentosCard
            mentosSeq={3}
            title="TypeScript 강의"
            price={60000}
            location="신촌"
            status="completed"
          />
          <MentosCard
            mentosSeq={4}
            title="Node.js 강의"
            price={55000}
            location="강남"
            status="completed"
          />
        </section>
      </section>
    </div>
  );
}
