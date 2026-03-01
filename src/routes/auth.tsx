import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import { AuthRoute } from "../types";

export const authRoutes: AuthRoute[] = [
  {
    path: "/auth/login",
    name: "Login",
    element: <Login />,
  },
  {
    path: "/auth/register",
    name: "Register",
    element: <Register />,
  },
];
