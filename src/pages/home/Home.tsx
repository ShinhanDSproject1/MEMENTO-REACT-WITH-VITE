// src/pages/home/Home.tsx
import { useAuth } from "@/entities/auth";
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

// 서버의 대문자 역할 → 화면용 소문자 역할로 매핑
function normalizeRole(memberType?: "MENTI" | "MENTO" | "ADMIN"): UserType | undefined {
  if (memberType === "MENTI") return "mentee";
  if (memberType === "MENTO") return "mentor";
  if (memberType === "ADMIN") return "admin";
  return undefined;
}

export default function Home() {
  const { user } = useAuth();
  const { state } = useLocation() as { state: HomeLocationState | null };

  const normalized = normalizeRole(user?.memberType);

  const effectiveUserType: UserType = normalized ?? state?.userType ?? "guest";
  const effectiveUserName = user?.memberName ?? state?.userName ?? null;
  const effectiveRecommend = state?.recommend ?? false;
  const effectiveUserProfileImage = state?.userProfileImage;

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
