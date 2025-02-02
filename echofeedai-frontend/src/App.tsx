import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "@/routes/Landing";
import NotFound from "./routes/error/NotFound";

// auth
import AuthLayout from "./routes/auth/AuthLayout";
import Signup from "./routes/auth/Signup";
import Signin from "./routes/auth/Signin";
import AuthIndex from "./routes/auth/AuthIndex";
import { loader as signinLoader } from "@/functions/loader/auth/signin";
import { action as signinAction } from "@/functions/action/auth/signin.action";
import { loader as signupLoader } from "@/functions/loader/auth/signup";
import { action as signupAction } from "@/functions/action/auth/signup.action";

// dashboard
import Dashboard from "./routes/dashboard/DashboardIndex";
import { loader as dashboardLoader } from "@/functions/loader/dashboard";
import { action as logoutAction } from "@/functions/action/auth/logout";
import { AuthErrorBoundary } from "./routes/auth/AuthError";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    children: [],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <AuthErrorBoundary />,
    children: [
      { index: true, element: <AuthIndex /> },
      {
        path: "signup",
        element: <Signup />,
        loader: signupLoader,
        action: signupAction,
      },
      {
        path: "signin",
        element: <Signin />,
        loader: signinLoader,
        action: signinAction,
      },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    loader: dashboardLoader,
    action: logoutAction,
    children: [],
  },
  {
    path: "*",
    loader: () => {
      throw new Response("Not found", { status: 404 });
    },
    errorElement: <NotFound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
