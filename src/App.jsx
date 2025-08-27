import "./index.css"; // 반드시 먼저: @import "tailwindcss" 들어있어야 함
import "./app.css"; // 그 다음: 내가 만든 CSS (여기서 @apply 사용)
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SplashGate from "./pages/SplashGate";

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
      <Route path="/about" element={null} />
    </Routes>
  );
}
