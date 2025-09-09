// components/RecomendBox.tsx
import NeedRecommend from "./NeedRecommend";
import RecommendCard from "./RecommendCard";

export interface RecomendBoxProps {
  userType?: string;
  recommend?: boolean;
}

export default function RecomendBox({ userType, recommend }: RecomendBoxProps) {
  if (userType !== "mentee") return null;

  return <div>{recommend ? <RecommendCard /> : <NeedRecommend />}</div>;
}
