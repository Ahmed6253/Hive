import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Loader from "./loader";
import { useEffect, useState } from "react";
const Layout = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2500);
  }, []);
  return (
    <div className="flex h-screen">
      <Loader isLoading={isLoading} />
      <Sidebar />
      <main className="flex-1 overflow-auto bg-card rounded-lg m-3 p-4">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
