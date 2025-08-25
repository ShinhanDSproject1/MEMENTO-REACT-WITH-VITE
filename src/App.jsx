import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import MyProfile from "./pages/MyProfile/MyProfile";
import Mentoprofile from "./pages/Mentoprofile/Mentoprofile";
import CreateMentos from "./pages/Mentos/CreateMentos";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/menti" element={<MyProfile />} />
        <Route path="/mento" element={<Mentoprofile />} />
        <Route path="/create-mentos" element={<CreateMentos />} />
      </Routes>
    </BrowserRouter>
  );
}
