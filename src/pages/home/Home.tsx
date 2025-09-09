// src/components/LoginBox.tsx
import AdminLoginBox from "@/components/main/loginBox/AdminLoginBox";
import GuestLoginBox from "@/components/main/loginBox/GuestLoginBox";
import MenteeLoginBox from "@/components/main/loginBox/MenteeLoginBox";
import MentoLoginBox from "@/components/main/loginBox/MentoLoginBox";

export interface LoginBoxProps {
  userType?: "mentee" | "mentor" | "admin" | "guest";
  userName?: string;
  userProfileImage?: string;
}

export default function LoginBox({
  userType = "guest",
  userName,
  userProfileImage,
}: LoginBoxProps) {
  switch (userType) {
    case "mentee":
      return <MenteeLoginBox userName={userName} />;
    case "mentor":
      return (
        <MentoLoginBox
          userName={userName}
          userProfileImage={userProfileImage}
        />
      );
    case "admin":
      return <AdminLoginBox />;
    case "guest":
    default:
      return <GuestLoginBox />;
  }
}
