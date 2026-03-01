import { BrowserRouter, Routes, Route as RouterRoute } from "react-router-dom";
import Layout from "./components/Layout";
import AuthLayout from "./pages/auth/AuthLayout";
import { systemRoutes } from "./routes/system";
import { authRoutes } from "./routes/auth";
import { Route, AuthRoute } from "./types";

function App() {
  return (
    <BrowserRouter>
      <Routes>
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

        <RouterRoute path="/auth" element={<AuthLayout />}>
          {authRoutes.map((route: AuthRoute) => (
            <RouterRoute
              key={route.path}
              path={route.path.replace("/auth/", "")}
              element={route.element}
            />
          ))}
        </RouterRoute>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
