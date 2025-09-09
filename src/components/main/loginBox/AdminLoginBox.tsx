// src/components/AdminLoginBox.tsx
import kogiri from "@/assets/images/character-fox.svg";

export interface AdminLoginBoxProps {
  userName?: string;
}

export default function AdminLoginBox({
  userName = "관리자",
}: AdminLoginBoxProps) {
  return (
    <div className="mx-auto w-full space-y-2 border-y border-[#76829718] bg-[#F0F4FA] pb-5 text-center">
      <div className="mb-4 flex items-center justify-center pt-4">
        <img src={kogiri} alt="관리자 아이콘" />
        <div className="font-WooridaumB pt-5 text-base font-bold">
          <span className="text-[#23272E] underline underline-offset-3">
            {userName}
          </span>
          <span className="text-[#768297]">님 안녕하세요!</span>
        </div>
      </div>
    </div>
  );
}
