import PropTypes from "prop-types";
import ButtonGroup from "@/components/main/buttonGroup/ButtonGroup";
import LoginBox from "@/components/main/loginBox/LoginBox";
import MainHeader from "@/components/main/mainHeader/MainHeader";
import Footer from "@/components/main/mainFooter/MainFooter";
import CharacterAni from "@/components/main/mainHeader/CharacterAni";
import HelpCard from "@/components/main/cardGroup/HelpCard";

export default function Home({ userType, userName, userProfileImage }) {
  userType = "mentor"; //test
  userName = "김대현"; //test

  return (
    <div className="mx-auto w-full max-w-100 rounded-xl bg-white">
      {/* <MainHeader /> */}
      <CharacterAni />
      <LoginBox userType={userType} userName={userName} userProfile={userProfileImage} />
      <ButtonGroup userType={userType} />
      <HelpCard />
      <Footer />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
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
      </div>
    </div>
  );
}

Home.propTypes = {
  userType: PropTypes.string,
  userName: PropTypes.string,
  userProfileImage: PropTypes.string,
};
