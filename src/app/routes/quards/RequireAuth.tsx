import { loadUserSnapshot } from "@shared/auth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function RequireAuth() {
  const snap = loadUserSnapshot();
  const location = useLocation();

  // accessToken 없으면 로그인으로
  if (!snap?.accessToken) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <Outlet />;
}
