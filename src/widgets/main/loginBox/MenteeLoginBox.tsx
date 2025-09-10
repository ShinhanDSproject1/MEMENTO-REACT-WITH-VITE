// src/components/MenteeLoginBox.tsx
import characterDog from "@assets/images/character/character-dog.svg";
import NeonButton from "@widgets/common/NeonButton";
import { useNavigate } from "react-router-dom";

export interface MenteeLoginBoxProps {
  userName?: string;
}

export default function MenteeLoginBox({ userName }: MenteeLoginBoxProps) {
  const navigate = useNavigate();

  return (
    <div>
      <div className="mx-auto w-full space-y-2 border-y border-[#76829718] bg-[#F0F4FA] pb-5 text-center">
        <div className="mb-4 flex items-center justify-center gap-3 pt-4">
          <img src={characterDog} alt="character-dog" />
          <div className="font-[WooridaumB] text-base font-bold">
            <span className="text-[#23272E] underline underline-offset-3">
              {userName ?? "게스트"}
            </span>
            <span className="text-[#768297]"> 멘티님 안녕하세요!</span>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            className="cursor-pointer rounded-full bg-[#005EF9] p-2 px-6 text-sm font-semibold text-white hover:bg-[#0C2D62] hover:shadow"
            onClick={() => navigate("/mentee/mymentos")}
          >
            나의 멘토링내역
          </button>
          <button
            className="ml-5 cursor-pointer rounded-full bg-[#005EF9] p-2 px-6 text-sm font-semibold text-white hover:bg-[#0C2D62] hover:shadow"
            onClick={() => navigate("/myprofile")}
          >
            나의 정보관리
          </button>
        </div>

        <div className="mt-4 flex justify-center">
          <NeonButton
            accentColor="#008578"
            accentHoverColor="#00BBA8"
            bgColor="#00BBA8"
            bgHoverColor="#008578"
            className="w-70 rounded-3xl"
            onClick={() => navigate("/chat")}
          >
            멘토와 채팅하기
          </NeonButton>
        </div>
      </div>
    </div>
  );
}
