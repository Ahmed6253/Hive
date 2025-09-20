import { NavLink } from "react-router-dom";
import { routes } from "../routes";
import { Route } from "../types";
import AnimatedLogo from "./AnimatedLogo";
import useSideBarStore from "../stores/useSideBar";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

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
        onClick={() => {
          !isOpen && toggleSideBar();
        }}
        className="flex h-16 items-center justify-between pl-4.5 relative cursor-pointer"
      >
        <AnimatedLogo isOpen={isOpen} />
        <ChevronLeftIcon
          onClick={toggleSideBar}
          className={`w-5 mt-8 cursor-pointer  transition-all duration-500 absolute ${
            !isOpen ? " opacity-0 -right-4" : " opacity-100 right-2"
          }`}
        />
      </div>
      <nav className="flex-1 flex gap-2 flex-col space-y-1 px-2 py-4 mt-5">
        {routes.map((route: Route) => (
          <NavLink
            key={route.name}
            to={route.path}
            className={({ isActive }) => `
              group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-500
              ${isActive ? "text-primary" : " hover:text-primary"}
              ${route.name === "Settings" ? "mt-auto pb-0" : ""}
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
    </div>
  );
};

export default Sidebar;
