// src/components/MentoLoginBox.tsx
import kogiri from "@assets/images/character/character-kogiri.svg";
import { useNavigate } from "react-router-dom";

export interface MentoLoginBoxProps {
  userName?: string;
  userProfileImage?: string;
}

export default function MentoLoginBox({
  userName,
  userProfileImage,
}: MentoLoginBoxProps) {
  const navigate = useNavigate();

  // 프로필 이미지가 있으면 그걸 사용, 없으면 기본 이미지
  const profileImg = userProfileImage || kogiri;

  return (
    <div className="mx-auto w-full space-y-2 border-y border-[#76829718] bg-[#F0F4FA] pb-5 text-center">
      <div className="mb-4 flex items-center justify-center gap-3 pt-4">
        <img
          src={profileImg}
          alt={`${userName ?? "멘토"} 프로필`}
          className="h-10 w-10 rounded-full border-2 border-gray-300 bg-white object-cover"
        />
        <div className="font-WooridaumB text-base font-bold">
          <span className="text-[#23272E] underline underline-offset-3">
            {userName ?? "게스트"}
          </span>
          <span className="text-[#768297]"> 멘토님 안녕하세요!</span>
        </div>
      </div>

      <button
        className="mx-auto cursor-pointer rounded-full bg-[#005EF9] p-2 px-6 text-sm font-semibold text-white hover:bg-[#0C2D62] hover:shadow"
        onClick={() => navigate("/mento")}
      >
        내 정보수정
      </button>
    </div>
  );
}
