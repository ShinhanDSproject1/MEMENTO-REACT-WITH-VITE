import "@/index.css"; // 반드시 먼저: @import "tailwindcss" 들어있어야 함
import MentosList from "@/pages/mentos/MentosList";
import MyMentosList from "@/pages/myProfile/MyMentosList";
import MemberReport from "@/pages/admin/MemberReport";
import ReportList from "@/pages/admin/ReportList";
import ChatListPage from "@/pages/chat/ChatListPage";
import ChatRoomPage from "@/pages/chat/ChatRoomPage";
import MentorProfile from "@/pages/myProfile/MentoProfile";
import { Outlet, Route, Routes } from "react-router-dom";
import MyProfile from "@/pages/myProfile/MyProfile";
import CreateMentos from "@/pages/mentor/CreateMentos";
import Home from "@/pages/home/Home";
import CommonHeader from "@/components/common/CommonHeader";
import MainHeader from "@/components/main/mainHeader/MainHeader";
import Login from "@/pages/login/Login";
import EditMentos from "@/pages/mentor/EditMentos";
import Reviews from "@/pages/mentor/Review.jsx";
import MentosDetail from "@/pages/myProfile/MyMentosList";
import CertificationRegister from "@/pages/mentos/CertificationRegister";
import MentoIntroduce from "@/pages/mentos/MentoIntroduce";
import CertificationPage from "@/pages/mentos/CertificationPage";
import SignupComplete from "@/pages/login/SignUpComplete";
import MentorSignup from "@/pages/login/MentorSignup";
import MenteeSignup from "@/pages/login/MenteeSignup";
import SignupSelect from "@/pages/login/SignupSelect";

const layoutStyle = "mx-auto min-h-screen w-full max-w-100 rounded-xl bg-white";

function HomeLayout() {
  return (
    <div className={layoutStyle}>
      <MainHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

function AppLayout() {
  return (
    <div className={layoutStyle}>
      <CommonHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      {/* 홈 전용 레이아웃 + 스플래시 */}
      <Route element={<HomeLayout />}>
        <Route index element={<Home />} />
      </Route>

      {/* 그 외 공통 레이아웃 */}
      <Route element={<AppLayout />}>
        <Route path="/mentee/:category" element={<MentosList />} />
        <Route path="/mentee/mentos-detail/:id" element={<MentosDetail />} />
        <Route path="/mentee/mymentos" element={<MyMentosList role={"menti"} />} />
        <Route path="/mento/my-list" element={<MyMentosList role={"mento"} />} />
        <Route path="/mento" element={<MentorProfile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/create-mentos" element={<CreateMentos />} />
        <Route path="/signup/" element={<SignupSelect />} />
        <Route path="/signup/mentor" element={<MentorSignup />} />
        <Route path="/signup/mentee" element={<MenteeSignup />} />
        <Route path="/signup-complete" element={<SignupComplete />} />
        <Route path="/edit/:id" element={<EditMentos />} />
        <Route path="/admin/report" element={<MemberReport />} />
        <Route path="/admin/declaration" element={<ReportList />} />
        <Route path="/chat" element={<ChatListPage />} />
        <Route path="/chat/:roomId" element={<ChatRoomPage />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/mento/certification" element={<CertificationRegister />} />
        <Route path="/mento/introduce" element={<MentoIntroduce />} />
        <Route path="/mento/certification/:result" element={<CertificationPage />} />
      </Route>
    </Routes>
  );
}
