// src/app/routes/index.tsx
import React, { Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";

// [ Layout ]
const HomeLayout = React.lazy(() => import("@/app/routes/layouts/HomeLayout"));
const AppLayout = React.lazy(() => import("@/app/routes/layouts/AppLayout"));
const Error400 = React.lazy(() => import("@/pages/home/Error400"));
const Error404 = React.lazy(() => import("@/pages/home/Error404"));
const Error500 = React.lazy(() => import("@/pages/home/Error500"));

// [ Home ]
const Home = React.lazy(() => import("@/pages/home/Home"));

// [ auth ]
const Login = React.lazy(() => import("@/pages/login/Login"));
const SignupSelect = React.lazy(() => import("@/pages/login/SignupSelect"));
const MentorSignup = React.lazy(() => import("@/pages/login/MentorSignup"));
const MenteeSignup = React.lazy(() => import("@/pages/login/MenteeSignup"));
const SignupComplete = React.lazy(() => import("@/pages/login/SignupComplete"));

const MentosList = React.lazy(() => import("@/pages/mentos/MentosList"));
const MentosDetail = React.lazy(() => import("@/pages/mentos/MentosDetail"));

const MyMentosList = React.lazy(() => import("@/pages/my-profile/MyMentosList"));
const MentorProfile = React.lazy(() => import("@/pages/my-profile/MentoProfile"));

const CreateMentos = React.lazy(() => import("@/pages/mentor/CreateMentos"));
const EditMentos = React.lazy(() => import("@/pages/mentor/EditMentos"));

const CertificationRegister = React.lazy(() => import("@/pages/mentos/CertificationRegister"));
const CertificationPage = React.lazy(() => import("@/pages/mentos/CertificationPage"));
const MentoIntroduce = React.lazy(() => import("@/pages/mentos/MentoIntroduce"));
const Reviews = React.lazy(() => import("@/pages/mentor/Review"));
const Ready = React.lazy(() => import("@/pages/home/Ready"));

const ChatListPage = React.lazy(() => import("@/pages/chat/ChatListPage"));
const ChatRoomPage = React.lazy(() => import("@/pages/chat/ChatRoomPage"));
const AnalyticsPage = React.lazy(() => import("@/pages/chat/AnalyticsPage"));

const MemberReport = React.lazy(() => import("@/pages/admin/MemberReport"));
const ReportList = React.lazy(() => import("@/pages/admin/ReportList"));

const HomeVideo = React.lazy(() => import("@/pages/home/HomeVideo"));
const BookingPage = React.lazy(() => import("@/pages/book/Booking"));
const BookingConfirm = React.lazy(() => import("@/pages/book/BookingConfirm"));
const MentoIntroduce2 = React.lazy(() => import("@/pages/book/MentoIntroduce2"));

// ✅ 새로 추가된 페이지
const PaySuccess = React.lazy(() => import("@/pages/book/PaySuccess"));
const MentorMapNearbyPage = React.lazy(() => import("@/pages/mentos/MentorMapNearbyPage"));

const withSuspense = (el: React.ReactNode) => (
  <Suspense fallback={<div className="p-6 text-sm text-gray-500">로딩 중…</div>}>{el}</Suspense>
);

export const router = createBrowserRouter([
  {
    element: withSuspense(<HomeLayout />),
    children: [{ index: true, element: withSuspense(<Home />) }],
    errorElement: withSuspense(<Error404 />),
  },

  { path: "/400", element: withSuspense(<Error400 />) },
  { path: "/500", element: withSuspense(<Error500 />) },

  {
    element: withSuspense(<AppLayout />),
    children: [
      { path: "/login", element: withSuspense(<Login />) },
      { path: "/signup", element: withSuspense(<SignupSelect />) },
      { path: "/signup/mentor", element: withSuspense(<MentorSignup />) },
      { path: "/signup/mentee", element: withSuspense(<MenteeSignup />) },
      { path: "/signup-complete", element: withSuspense(<SignupComplete />) },

      { path: "/mentee/:category", element: withSuspense(<MentosList />) },
      { path: "/mentee/mentos-detail/:id", element: withSuspense(<MentosDetail />) },
      { path: "/mentee/mymentos", element: withSuspense(<MyMentosList role="menti" />) },

      { path: "/mento/my-list", element: withSuspense(<MyMentosList role="mento" />) },
      { path: "/mento", element: withSuspense(<MentorProfile />) },
      { path: "/mento/nearby", element: withSuspense(<MentorMapNearbyPage />) }, // ← 추가
      { path: "/create-mentos", element: withSuspense(<CreateMentos />) },
      { path: "/edit/:id", element: withSuspense(<EditMentos />) },
      { path: "/mento/certification", element: withSuspense(<CertificationRegister />) },
      { path: "/mento/certification/:result", element: withSuspense(<CertificationPage />) },
      { path: "/mento/introduce", element: withSuspense(<MentoIntroduce />) },
      { path: "/mento/introduce2", element: withSuspense(<MentoIntroduce2 />) },

      { path: "/reviews", element: withSuspense(<Reviews />) },
      { path: "/ready", element: withSuspense(<Ready />) },

      { path: "/chat", element: withSuspense(<ChatListPage />) },
      { path: "/chat/:roomId", element: withSuspense(<ChatRoomPage />) },
      { path: "/analytics", element: withSuspense(<AnalyticsPage />) },

      { path: "/admin/report", element: withSuspense(<MemberReport />) },
      { path: "/admin/declaration", element: withSuspense(<ReportList />) },

      { path: "/booking", element: withSuspense(<BookingPage />) },
      { path: "/booking/confirm", element: withSuspense(<BookingConfirm />) },
      { path: "/payments/success", element: withSuspense(<PaySuccess />) },
      { path: "/booking/success", element: withSuspense(<PaySuccess />) }, // 임시 호환

      { path: "/video", element: withSuspense(<HomeVideo />) },
    ],
  },

  { path: "*", element: withSuspense(<Error404 />) },
]);
