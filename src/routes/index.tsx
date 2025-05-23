import React from "react";
import {
  HomeIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  GiftIcon,
  CogIcon,
} from "@heroicons/react/24/outline";
import Home from "../pages/Home";
import Workspace from "../pages/Workspace";
import Notes from "../pages/Notes";
import Rewards from "../pages/Rewards";
import Settings from "../pages/Settings";
import { Route } from "../types";

export const routes: Route[] = [
  {
    path: "/",
    name: "Home",
    element: <Home />,
    icon: HomeIcon,
  },
  {
    path: "/workspace",
    name: "Workspace",
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
    icon: CogIcon,
  },
];
