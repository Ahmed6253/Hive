import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";

export default function RouteProtection({
  routeType = "system",
}: {
  routeType?: "system" | "auth";
}) {
  const { user } = useAuthStore();

  if (routeType === "system") {
    if (!user) {
      return <Navigate to="/auth/login" replace />;
    }
    return <Outlet />;
  } else if (routeType === "auth") {
    if (user) {
      return <Navigate to="/" replace />;
    }
    return <Outlet />;
  }
}
