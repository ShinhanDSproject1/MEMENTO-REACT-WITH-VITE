import dogFront from "@assets/images/character/character-dog-serch.png";
import { BarChart, LineChart, PieChart, Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const messages = [
    {
      text: "데이터 탐색 중...",
      icon: <Search className="mr-2 inline-block text-blue-500" size={22} />,
    },
    {
      text: "추천 멘토링 분석 중...",
      icon: <BarChart className="mr-2 inline-block text-pink-500" size={22} />,
    },
    {
      text: "최적의 결과를 찾고 있어요!",
      icon: <PieChart className="mr-2 inline-block text-purple-500" size={22} />,
    },
    {
      text: "멘토-멘티 매칭률 계산 중...",
      icon: <LineChart className="mr-2 inline-block text-emerald-500" size={22} />,
    },
    {
      text: "관심 분야 키워드 추출 중...",
      icon: <Search className="mr-2 inline-block text-orange-500" size={22} />,
    },
    {
      text: "분석 리포트 정리 중...",
      icon: <BarChart className="mr-2 inline-block text-indigo-500" size={22} />,
    },
  ];

  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIdx((p) => (p + 1) % messages.length), 2500);
    return () => clearInterval(t);
  }, [messages.length]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-pink-50">
      <img
        src={dogFront}
        alt="돋보기를 든 탐정 강아지"
        className="animate-wiggle w-[260px] drop-shadow-2xl select-none"
        draggable={false}
      />
      <p key={idx} className="animate-fade mt-8 text-xl font-semibold text-gray-700">
        {messages[idx].icon}
        {messages[idx].text}
      </p>
    </div>
  );
}
