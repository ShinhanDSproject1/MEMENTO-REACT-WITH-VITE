import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MyProfile from "./pages/MyProfile/MyProfile";
import CreateMentos from "./pages/Mentos/CreateMentos.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menti" element={<MyProfile />} />
        <Route path="/create-mentos" element={<CreateMentos />} />
      </Routes>
    </BrowserRouter>
  );
}
