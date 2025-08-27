import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MyProfile from "./pages/MyProfile/MyProfile";
import CreateMentos from "./pages/Mentos/CreateMentos.jsx";
import EditMentos from "./pages/Mentos/EditMentos.jsx";
import Reviews from "@/pages/MyProfile/Review.jsx";
import "./index.css"; // 반드시 먼저: @import "tailwindcss" 들어있어야 함
import "./app.css"; // 그 다음: 내가 만든 CSS (여기서 @apply 사용)
import SplashGate from "./pages/SplashGate";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 메인 홈 */}
        <Route path="/" element={<Home />} />

        {/* 내 프로필 */}
        <Route path="/menti" element={<MyProfile />} />

        {/* 멘토링 생성 */}
        <Route path="/create" element={<CreateMentos />} />

        {/* 멘토링 수정 */}
        <Route path="/edit/:id" element={<EditMentos />} />

        <Route path="/my/reviews" element={<Reviews />} />
      </Routes>
    </BrowserRouter>
  );
}
