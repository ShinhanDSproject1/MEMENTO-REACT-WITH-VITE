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
    </div>
  );
}

Home.propTypes = {
  userType: PropTypes.string,
  userName: PropTypes.string,
  userProfileImage: PropTypes.string,
};
