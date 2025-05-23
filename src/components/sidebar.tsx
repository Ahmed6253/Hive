import { NavLink } from "react-router-dom";
import { routes } from "../routes";
import { Route } from "../types";

const Sidebar = () => {
  return (
    <div className="flex h-screen w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-16 items-center px-4">
        <h1 className="text-xl font-bold">Hive</h1>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4">
        {routes.map((route: Route) => (
          <NavLink
            key={route.name}
            to={route.path}
            className={({ isActive }) => `
              group flex items-center px-2 py-2 text-sm font-medium rounded-md
              ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
              }
            `}
          >
            <route.icon
              className="mr-3 h-6 w-6 flex-shrink-0"
              aria-hidden="true"
            />
            {route.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;
