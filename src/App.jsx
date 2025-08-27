import { Outlet, BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MyProfile from "./pages/MyProfile/MyProfile";
import CreateMentos from "./pages/Mentos/CreateMentos.jsx";
import EditMentos from "./pages/Mentos/EditMentos.jsx";
import Reviews from "@/pages/MyProfile/Review.jsx";
import "./index.css"; // 반드시 먼저: @import "tailwindcss" 들어있어야 함
import SplashGate from "./pages/Home/SplashGate";
import CommonHeader from "./components/common/CommonHeader";
import MainHeader from "./components/main/mainHeader/MainHeader";

function HomeLayout() {
  return (
    <div className="mx-auto w-100 max-w-5xl rounded-xl bg-white">
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
    <div className="mx-auto w-100 max-w-5xl rounded-xl bg-white">
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
        {/* 내 프로필 */}
        <Route path="/menti" element={<MyProfile />} />

        {/* 멘토링 생성 */}
        <Route path="/create" element={<CreateMentos />} />

        {/* 멘토링 수정 */}
        <Route path="/edit/:id" element={<EditMentos />} />

        <Route path="/my/reviews" element={<Reviews />} />
      </Route>
    </Routes>
  );
}
