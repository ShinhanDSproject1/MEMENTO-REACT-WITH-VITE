import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import ButtonGroup from "@/components/main/buttonGroup/ButtonGroup";
import LoginBox from "@/components/main/loginBox/LoginBox";
import Footer from "@/components/main/mainFooter/MainFooter";
import CharacterAni from "@/components/main/mainHeader/CharacterAni";
import HelpCard from "@/components/main/cardGroup/HelpCard";
import { useLocation } from "react-router-dom";

export default function Home({ userType, userName, userProfileImage }) {
  const { state } = useLocation();
  userType = state?.userType ?? "guest";
  userName = state?.userName ?? null;

  return (
    <div className="mx-auto w-full max-w-100 rounded-xl bg-white">
      <CharacterAni />
      <LoginBox userType={userType} userName={userName} userProfile={userProfileImage} />
      <ButtonGroup userType={userType} />
      <HelpCard />
      <Footer />
      {/* <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2>Home 화면</h2>
        <div style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <Link to="/menti">
            <button>멘티 화면</button>
          </Link>
          <Link to="/mento">
            <button>멘토 화면</button>
          </Link>

          <Link to="/create">
            <button>멘토 생성하기</button>
          </Link>

          <Link to="/edit/1">
            <button>멘토 수정하기</button>
          </Link>
        </div>
      </div> */}
    </div>
  );
}

Home.propTypes = {
  userType: PropTypes.string,
  userName: PropTypes.string,
  userProfileImage: PropTypes.string,
};
