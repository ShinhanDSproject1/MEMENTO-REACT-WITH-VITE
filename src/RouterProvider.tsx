import { createBrowserRouter, RouterProvider as RRProvider } from "react-router-dom";
import AppLayout from "@/app/routes/layouts/AppLayout";
import HomeLayout from "@/app/routes/layouts/HomeLayout";
// TODO: 실제 라우트 컴포넌트들 import

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <HomeLayout /> },
      // { path: "/booking", element: <BookingPage /> },
      // ...
    ],
  },
]);

export default function AppRouterProvider() {
  return <RRProvider router={router} />;
}
