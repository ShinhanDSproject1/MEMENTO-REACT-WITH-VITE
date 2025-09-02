import MentosList from "@/pages/mentos/MentosList";
import MyMentosList from "./pages/myProfile/MyMentosList";
import MemberReport from "./pages/admin/MemberReport";
import ReportList from "./pages/admin/ReportList";
import ChatListPage from "./pages/chat/ChatListPage";
import ChatRoomPage from "./pages/chat/ChatRoomPage";
import MentorProfile from "./pages/myProfile/MentoProfile";
import "./index.css"; // 반드시 먼저: @import "tailwindcss" 들어있어야 함
import { Outlet, Route, Routes } from "react-router-dom";
import MyProfile from "./pages/myProfile/MyProfile";
import CreateMentos from "./pages/mentor/CreateMentos";
import Home from "./pages/Home/Home";
import CommonHeader from "./components/common/CommonHeader";
import MainHeader from "./components/main/mainHeader/MainHeader";
import Login from "./pages/Login/Login";
import EditMentos from "@/pages/mentor/EditMentos.jsx";
import Reviews from "@/pages/mentor/Review.jsx";
import SignupComplete from "./pages/Login/SignUpComplete";
import MentorSignup from "./pages/Login/MentorSignup";
import MenteeSignup from "./pages/Login/MenteeSignup";
import SignupSelect from "./pages/Login/SignupSelect";
import AnalyticsPage from "./pages/chat/AnalyticsPage";

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
        <Route path="/mentos/category/:category_seq" element={<MentosList />} />
        <Route path="/menti/my-mentos-list" element={<MyMentosList role={"menti"} />} />
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

        <Route path="/analytics" element={<AnalyticsPage />} />
      </Route>
    </Routes>
  );
}
