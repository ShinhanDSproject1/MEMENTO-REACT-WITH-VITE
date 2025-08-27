import "./index.css"; // 반드시 먼저: @import "tailwindcss" 들어있어야 함
import { Outlet, Route, Routes } from "react-router-dom";
import MyProfile from "./pages/MyProfile/MyProfile";
import CreateMentos from "./pages/Mentos/CreateMentos";
import Home from "./pages/Home/Home";
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
        <Route path="/mentee/myprofile" element={<MyProfile />} />
        <Route path="/create-mentos" element={<CreateMentos />} />
      </Route>
    </Routes>
  );
}
