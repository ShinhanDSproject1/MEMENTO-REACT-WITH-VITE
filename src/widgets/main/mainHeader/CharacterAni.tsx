import characterFull from "@assets/images/character/character-full.svg";

function CharacterAni() {
  return (
    <div>
      <p className="px-7 text-left text-xs text-[#757575]">
        당신의 소중한 제테크를 AI가 추천한 멘토와 함께하세요!
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
