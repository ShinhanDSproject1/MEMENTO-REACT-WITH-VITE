import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MyProfile from "./pages/MyProfile/MyProfile";
import CreateMentos from "./pages/Mentos/CreateMentos.jsx";
import EditMentos from "./pages/Mentos/EditMentos.jsx";
import Reviews from "@/pages/MyProfile/Review.jsx";

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
