import "./index.css"; // 반드시 먼저: @import "tailwindcss" 들어있어야 함
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SplashGate from "./pages/SplashGate";
import MyProfile from "./pages/MyProfile/MyProfile";
import CreateMentos from "./pages/Mentos/CreateMentos";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <SplashGate>
            <Home />
          </SplashGate>
        }
      />
      <Route path="/" element={<Home />} />
      <Route path="/menti" element={<MyProfile />} />
      <Route path="/create-mentos" element={<CreateMentos />} />
    </Routes>
  );
}
