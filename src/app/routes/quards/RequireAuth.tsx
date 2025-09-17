import { useAuth } from "@/entities/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth() {
  const { isAuthenticated } = useAuth(); // 컨텍스트만 신뢰
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
