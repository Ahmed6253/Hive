import { NavLink } from "react-router-dom";
import { systemRoutes } from "../routes/system";
import { Route } from "../types";
import AnimatedLogo from "./AnimatedLogo";
import useSideBarStore from "../stores/useSideBar";

import { ChevronLeft, LogOut } from "lucide-react";
import { Button } from "./ui/button";

const Sidebar = () => {
  const isOpen = useSideBarStore((state) => state.isOpen);
  const toggleSideBar = useSideBarStore((state) => state.toggleSideBar);

  return (
    <div
      className={`flex h-screen absolute sm:static   flex-col bg-transparent transition-all duration-500  overflow-hidden ${
        isOpen ? "sm:w-46 w-full " : "w-15"
      }`}
    >
      <div
        onClick={toggleSideBar}
        className="flex h-16 items-center justify-between pl-4.5 relative cursor-pointer"
      >
        <AnimatedLogo isOpen={isOpen} />

        <ChevronLeft
          strokeWidth={3}
          className={`w-5  cursor-pointer bottom-1 transition-all duration-500 absolute ${
            !isOpen
              ? "text-bg rotate-180 right-4 bottom-[0.75rem]"
              : " opacity-100 right-2"
          }`}
        />
      </div>
      <nav className="flex-1 flex gap-2 flex-col space-y-1 px-2 mt-8">
        {systemRoutes.map((route: Route) => (
          <NavLink
            key={route.name}
            to={route.path}
            className={({ isActive }) => `
              group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-500
              ${isActive ? "text-primary" : " hover:text-primary/70"}
              ${route.name === "Settings" ? "pb-0 mt-auto" : ""}
            `}
          >
            <route.icon
              className="mr-3 h-6 w-6 flex-shrink-0"
              aria-hidden="true"
            />
            <span
              className={` overflow-hidden transition-all duration-500 ${
                !isOpen ? "w-0" : "w-fit"
              }`}
            >
              {route.name}
            </span>
          </NavLink>
        ))}
      </nav>
      <div className="px-2 py-4">
        <Button className="w-full justify-start" variant={"ghost"}>
          <LogOut />
          <span
            className={` overflow-hidden transition-all duration-500 ${
              !isOpen ? "w-0" : "w-fit"
            }`}
          >
            Logout
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
