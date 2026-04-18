import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

import useSideBarStore from "../stores/useSideBar";

const Layout = () => {
  const isOpen = useSideBarStore((state) => state.isOpen);

  return (
    <div className="flex h-screen">
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
