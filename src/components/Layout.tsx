import { Outlet } from "react-router-dom";
import Sidebar from "./sidebar";
import Loader from "./loader";
import { useEffect, useState } from "react";
import useSideBarStore from "../stores/useSideBar";

const Layout = () => {
  const isOpen = useSideBarStore((state) => state.isOpen);
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

      <main
        className={`flex-1 ml-15 overflow-auto bg-cont-color rounded-lg m-3 sm:ml-0 p-6 ${
          isOpen && "sm:block hidden "
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
