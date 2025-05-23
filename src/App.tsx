import { BrowserRouter, Routes, Route as RouterRoute } from "react-router-dom";
import Layout from "./components/Layout";
import { routes } from "./routes";
import { Route } from "./types";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <RouterRoute path="/" element={<Layout />}>
          {routes.map((route: Route) =>
            route.path === "/" ? (
              <RouterRoute key="home" index element={route.element} />
            ) : (
              <RouterRoute
                key={route.path}
                path={route.path.slice(1)}
                element={route.element}
              />
            )
          )}
        </RouterRoute>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
