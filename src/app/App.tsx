import { router } from "@/app/routes/index";
import { RouterProvider } from "react-router-dom";
import AppProviders from "./providers/AppProviders";

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
