import character from "@assets/images/character-dog.svg";
import logo from "@assets/images/memento-logo.svg";
import { useNavigate } from "react-router-dom";

function Error500() {
  const navigate = useNavigate();
  return (
    <section className="mx-auto h-full w-full max-w-100 bg-white text-center">
      <img
        src={logo}
        alt="memento logo"
        className="mx-auto h-auto w-60 py-15"
      />
      <img src={character} alt="character fox" className="mx-auto mt-20 w-30" />
      <div className="flex-col items-center justify-center">
        <div className="flex items-center justify-center text-8xl">
          <p className="font-bold text-[#00BBA8]">5</p>
          <p className="font-bold text-[#016BC7]">00</p>
        </div>
      </div>
      <button
        className="font-WooridaumB mt-10 h-10 w-70 rounded-lg bg-[#005EF9] text-center font-bold text-white hover:bg-[#0C2D62]"
        onClick={() => navigate("/")}
      >
        <p>뒤로가기</p>
      </button>
    </section>
  );
}

export default Error500;
