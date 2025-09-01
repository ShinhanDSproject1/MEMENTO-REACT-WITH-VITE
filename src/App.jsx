import MentosList from "@/pages/Mentos/MentosList";
import MyMentosList from "./pages/MyProfile/MyMentosList";
import MemberReport from "./pages/Admin/MemberReport";
import ReportList from "./pages/Admin/ReportList";
import ChatListPage from "./pages/Chat/ChatListPage";
import ChatRoomPage from "./pages/Chat/ChatRoomPage";
import MentorProfile from "./pages/MyProfile/MentoProfile";
import "./index.css"; // 반드시 먼저: @import "tailwindcss" 들어있어야 함
import { Outlet, Route, Routes } from "react-router-dom";
import MyProfile from "./pages/MyProfile/MyProfile";
import CreateMentos from "./pages/Mentor/CreateMentos";
import Home from "./pages/Home/Home";
import SplashGate from "./pages/Home/SplashGate";
import CommonHeader from "./components/common/CommonHeader";
import MainHeader from "./components/main/mainHeader/MainHeader";
import Login from "./pages/Login/Login";
import EditMentos from "@/pages/Mentor/EditMentos.jsx";
import Reviews from "@/pages/Mentor/Review.jsx";
import MentosDetail from "./pages/Mentos/MentosDetail";
import CertificationRegister from "./pages/Mentos/CertificationRegister";
import MentoIntroduce from "./pages/Mentos/MentoIntroduce";
import CertificationPage from "./pages/Mentos/CertificationPage";

const layoutStyle = "mx-auto min-h-screen w-full max-w-100 rounded-xl bg-white";

function HomeLayout() {
  return (
    <div className={layoutStyle}>
      <SplashGate>
        <>
          <MainHeader />
          <main>
            <Outlet />
          </main>
        </>
      </SplashGate>
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
