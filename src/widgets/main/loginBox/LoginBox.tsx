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
  switch (userType) {
    case "mentee":
      return <MenteeLoginBox userName={userName} />;
    case "mentor":
      return <MentoLoginBox userName={userName} userProfileImage={userProfileImage ?? ""} />;
    case "admin":
      return <AdminLoginBox />;
    default:
      return <GuestLoginBox />;
  }
}
