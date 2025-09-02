import PropTypes from "prop-types";
import ButtonGroup from "@/components/main/buttonGroup/ButtonGroup";
import LoginBox from "@/components/main/loginBox/LoginBox";
import Footer from "@/components/main/mainFooter/MainFooter";
import CharacterAni from "@/components/main/mainHeader/CharacterAni";
import HelpCard from "@/components/main/cardGroup/HelpCard";
import { useLocation } from "react-router-dom";
import RecomendBox from "@/components/main/cardGroup/RecomendBox";

export default function Home({ userType, userName, userProfileImage, recommend }) {
  const { state } = useLocation();
  userType = state?.userType ?? "guest";
  userName = state?.userName ?? null;
  recommend = state?.recommend ?? false;
  return (
    <div className="mx-auto w-full max-w-100 rounded-xl bg-white">
      <CharacterAni />
      <LoginBox userType={userType} userName={userName} userProfile={userProfileImage} />
      <RecomendBox userType={userType} recommend={recommend} />
      <ButtonGroup userType={userType} />
      <HelpCard />
      <Footer />
    </div>
  );
}

Home.propTypes = {
  userType: PropTypes.string,
  userName: PropTypes.string,
  userProfileImage: PropTypes.string,
  recommend: PropTypes.bool,
};
