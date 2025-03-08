import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Landing from "@/routes/Landing";
import NotFound from "./routes/error/NotFound";

// landing
import { loader as landingLoader } from "@/functions/loader/landing.loader";

// auth
import AuthLayout from "./routes/auth/AuthLayout";
import Signup from "./routes/auth/Signup";
import Signin from "./routes/auth/Signin";
import AuthIndex from "./routes/auth/AuthIndex";
import { loader as signinLoader } from "@/functions/loader/auth/signin";
import { action as signinAction } from "@/functions/action/auth/signin.action";
import { loader as signupLoader } from "@/functions/loader/auth/signup";
import { action as signupAction } from "@/functions/action/auth/signup.action";

// home
import { loader as homeLoader } from "@/functions/loader/home";
import { action as logoutAction } from "@/functions/action/auth/logout.action";
import { AuthErrorBoundary } from "./routes/auth/AuthError";
import HomeLayout from "./routes/home/HomeLayout";
import HomeIndex from "./routes/home/HomeIndex";

// feature
import { loader as featureLoader } from "@/functions/loader/feature";
import FeatureLayout from "./routes/feature/FeatureLayout";
import FeatureIndex from "./routes/feature/FeatureIndex";

// feature/generate
import Generate from "./routes/feature/generate/Generate";
import { action as generateAction } from "@/functions/action/feature/generate/gnerate.action";

// feature/respond
import Respond from "./routes/feature/respond/Respond";
import { action as respondAction } from "@/functions/action/feature/respond/respond.action";
import { loader as respondLoader } from "@/functions/loader/feature/respond/respond.loader";

// thank you
import Thankyou from "./routes/Thankyou";

// feature/source
import Source from "./routes/feature/source/Source";
import { loader as SourceListLoader } from "@/functions/loader/feature/source/source.loader";
// feature/source/new
import { NewSource } from "./routes/feature/source/Source.new";
import { action as NewSourceAction } from "@/functions/action/feature/source/new-source.action";
// feature/source/edit
import { EditSource } from "./routes/feature/source/Source.edit";
import { loader as EditSourceLoader } from "@/functions/loader/feature/source/edit-source.loader";
import { action as EditSourceAction } from "@/functions/action/feature/source/edit-source.action";
// feature/source/delete
import { action as SourceDeleteAction } from "@/functions/action/feature/source/delete-source.action";
// feature/source [ add participant ]
import { action as AddParticipantAction } from "@/functions/action/feature/source/add-participant-source.action";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
    loader: landingLoader,
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
    path: "/home",
    element: <HomeLayout />,
    loader: homeLoader,
    children: [
      {
        index: true,
        element: <HomeIndex />,
        action: logoutAction,
      },
    ],
  },
  {
    path: "/feature",
    element: <FeatureLayout />,
    loader: featureLoader,
    children: [
      {
        index: true,
        element: <FeatureIndex />,
      },
      {
        path: "generate",
        action: generateAction,
        element: <Generate />,
      },
      {
        path: "respond",
        loader: respondLoader,
        action: respondAction,
        element: <Respond />,
      },
      {
        path: "source",
        children: [
          {
            index: true,
            element: <Source />,
            loader: SourceListLoader,
          },
          {
            path: "new",
            action: NewSourceAction,
            element: <NewSource />,
          },
          {
            path: "edit/:id",
            action: EditSourceAction,
            loader: EditSourceLoader,
            element: <EditSource />,
          },
          {
            path: "delete/:id",
            action: SourceDeleteAction,
          },
          {
            path: "add-participant/:id",
            action: AddParticipantAction,
          },
        ],
      },
    ],
  },
  {
    path: "/thankyou",
    loader: homeLoader,
    element: <Thankyou />,
  },
  {
    path: "/logout",
    action: logoutAction,
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
