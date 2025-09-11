import characterFull from "@/assets/images/character-full.svg";

function CharacterAni() {
  return (
    <div>
      <p className="px-7 text-left text-xs text-[#757575]">
        AI 추천 멘토링으로 당신의 자산을 현명하게 관리하세요!
      </p>
      <img
        src={characterFull}
        alt="character-full"
        className="mx-auto w-80 animate-[floaty_3s_ease-in-out_infinite]"
      />
    </div>
  );
}

export default CharacterAni;
