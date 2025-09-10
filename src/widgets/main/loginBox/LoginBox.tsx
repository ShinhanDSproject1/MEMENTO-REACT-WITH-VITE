// src/components/LoginBox.tsx
import AdminLoginBox from "./AdminLoginBox";
import GuestLoginBox from "./GuestLoginBox";
import MenteeLoginBox from "./MenteeLoginBox";
import MentoLoginBox from "./MentoLoginBox";

export interface LoginBoxProps {
  userType?: "mentee" | "mentor" | "admin" | "guest"; // 유저 타입
  userName?: string;
  userProfileImage?: string;
}

export default function LoginBox({ userType, userName, userProfileImage }: LoginBoxProps) {
  if (userType === "mentee") {
    return <MenteeLoginBox userName={userName ?? ""} />;
  } else if (userType === "mentor") {
    return <MentoLoginBox userName={userName ?? ""} userProfileImage={userProfileImage ?? ""} />;
  } else if (userType === "admin") {
    return <AdminLoginBox />;
  } else {
    return <GuestLoginBox />;
  }
}
