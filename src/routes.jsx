import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";
import AppLayout from "@/components/layout/AppLayout"; // 공통 레이아웃
import Splash from "@/components/Splash";

const Home = lazy(() => import("@/pages/Home"));
const About = lazy(() => import("@/pages/About")); // 예시용 다른 페이지

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />, // 헤더 + 공통 레이아웃
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Splash />}>
            <Home />
          </Suspense>
        ),
      },
      {
        path: "about",
        element: (
          <Suspense fallback={<Splash />}>
            <About />
          </Suspense>
        ),
      },
    ],
  },
]);
