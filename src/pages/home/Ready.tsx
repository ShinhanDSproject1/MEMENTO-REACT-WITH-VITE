import { useNavigate } from "react-router-dom";

function Ready() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto mt-10 text-center">
      <p className="font-WooridaumB text-3xl text-[#23272E]"> 서비스 준비중 입니다</p>
      <p className="font-WooridaumB mt-3 text-lg text-[#768297]"> 아쉽지만 다음을 기대해주세요!</p>
      <img
        src="../src/shared/assets/images/character/character-full-dance.svg"
        className="mx-auto mt-10 w-75 animate-[floaty_3s_ease-in-out_infinite]"
      />
      <button
        className="font-WooridaumB mt-10 h-10 w-70 rounded-lg bg-[#005EF9] text-center font-bold text-white hover:bg-[#0C2D62]"
        onClick={() => navigate("/")}>
        <p>뒤로가기</p>
      </button>
    </section>
  );
}

export default Ready;
