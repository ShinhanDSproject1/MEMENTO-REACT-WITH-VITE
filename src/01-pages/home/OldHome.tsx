// src/pages/home/Home.tsx
import {
  CharacterAni,
  HelpCard,
  LoginBox,
  MainFooter,
  NearbyBanner,
  RecommendBox,
} from "@/02-widgets/main";
import Index from "@/02-widgets/main/buttonGroup/index";
import { useAuth } from "@entities/auth";
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
      <NearbyBanner userType={effectiveUserType} />
      <LoginBox
        userType={effectiveUserType}
        userName={effectiveUserName ?? ""}
        userProfileImage={effectiveUserProfileImage}
      />
      <RecommendBox userType={effectiveUserType} recommend={effectiveRecommend} />
      <Index userType={effectiveUserType} />
      <HelpCard />
      <MainFooter />
    </div>
  );
}
