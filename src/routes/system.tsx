import {
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  GiftIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
import Home from "../pages/Home";
import Workspace from "../pages/Workspace/Workspace";
import Notes from "../pages/Notes";
import Rewards from "../pages/Rewards";
import Settings from "../pages/Settings";
import { Route } from "../types";

export const systemRoutes: Route[] = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
    icon: HomeIcon,
  },
  {
    path: "/workspaces",
    name: "Workspaces",
    element: <Workspace />,
    icon: BriefcaseIcon,
  },
  {
    path: "/notes",
    name: "Notes",
    element: <Notes />,
    icon: DocumentTextIcon,
  },
  {
    path: "/rewards",
    name: "Rewards",
    element: <Rewards />,
    icon: GiftIcon,
  },
  {
    path: "/settings",
    name: "Settings",
    element: <Settings />,
    icon: Cog6ToothIcon,
  },
];
