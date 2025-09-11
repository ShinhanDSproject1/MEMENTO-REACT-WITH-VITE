// src/pages/home/Home.tsx
import Index from "@/widgets/main/buttonGroup/index";
import HelpCard from "@/widgets/main/cardGroup/HelpCard";
import RecomendBox from "@/widgets/main/cardGroup/RecomendBox";
import LoginBox from "@/widgets/main/loginBox/LoginBox";
import Footer from "@/widgets/main/mainFooter/MainFooter";
import CharacterAni from "@/widgets/main/mainHeader/CharacterAni";
import { useLocation } from "react-router-dom";

type UserType = "mentee" | "mentor" | "admin" | "guest";

interface HomeLocationState {
  userType?: UserType;
  userName?: string | null;
  userProfileImage?: string;
  recommend?: boolean;
}

interface HomeProps {
  userType?: UserType;
  userName?: string | null;
  userProfileImage?: string;
  recommend?: boolean;
}

export default function Home({
  userType = "guest",
  userName = null,
  userProfileImage,
  recommend = false,
}: HomeProps) {
  const { state } = useLocation() as { state: HomeLocationState | null };

  // location.state가 있으면 우선 적용
  const effectiveUserType: UserType = state?.userType ?? userType ?? "guest";
  const effectiveUserName = state?.userName ?? userName ?? null;
  const effectiveRecommend = state?.recommend ?? recommend ?? false;
  const effectiveUserProfileImage = state?.userProfileImage ?? userProfileImage;

  return (
    <div className="mx-auto w-full max-w-100 rounded-xl bg-white">
      <CharacterAni />
      <LoginBox
        userType={effectiveUserType}
        userName={effectiveUserName ?? ""}
        userProfileImage={effectiveUserProfileImage}
      />
      <RecomendBox userType={effectiveUserType} recommend={effectiveRecommend} />
      <Index userType={effectiveUserType} />
      <HelpCard />
      <Footer />
    </div>
  );
}
