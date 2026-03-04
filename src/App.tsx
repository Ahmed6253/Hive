import { BrowserRouter, Routes, Route as RouterRoute } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import AuthLayout from "./pages/auth/AuthLayout";
import { systemRoutes } from "./routes/system";
import { authRoutes } from "./routes/auth";
import { Route, AuthRoute } from "./types";
import RouteProtection from "./routes/routeProtction/RouteProtction";
import { axiosInstance } from "@/lib/axios";
import { AuthState, useAuthStore } from "@/stores/useAuthStore";
import { useQuery } from "@tanstack/react-query";
import Loader from "./components/loader";

function App() {
  const saveUser = useAuthStore((state: AuthState) => state.saveUser);
  const user = useAuthStore((state: AuthState) => state.user);

  const checkAuth = async () => {
    if (user) {
      return user;
    }
    const response = await axiosInstance.get("/auth/check");

    if (response.data.user) {
      saveUser(response.data.user);
    } else {
      saveUser(null);
    }
    return response.data;
  };

  const { isLoading } = useQuery({
    queryKey: ["checkAuth"],
    queryFn: checkAuth,
    retry: false,
  });
  return (
    <>
      {isLoading ? (
        <Loader isLoading={isLoading} />
      ) : (
        <>
          <BrowserRouter>
            <Routes>
              <RouterRoute element={<RouteProtection routeType="system" />}>
                <RouterRoute path="/" element={<Layout />}>
                  {systemRoutes.map((route: Route) =>
                    route.path === "/" ? (
                      <RouterRoute key="home" index element={route.element} />
                    ) : (
                      <RouterRoute
                        key={route.path}
                        path={route.path.slice(1)}
                        element={route.element}
                      />
                    ),
                  )}
                </RouterRoute>
              </RouterRoute>
              <RouterRoute element={<RouteProtection routeType="auth" />}>
                <RouterRoute path="/auth" element={<AuthLayout />}>
                  {authRoutes.map((route: AuthRoute) => (
                    <RouterRoute
                      key={route.path}
                      path={route.path.replace("/auth/", "")}
                      element={route.element}
                    />
                  ))}
                </RouterRoute>
              </RouterRoute>
            </Routes>
          </BrowserRouter>
          <Toaster position="top-center" />
        </>
      )}
    </>
  );
}

export default App;
