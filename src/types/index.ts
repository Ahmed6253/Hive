import { SVGProps } from "react";

export interface Route {
  path: string;
  name: string;
  element: React.ReactNode;
  icon: React.ComponentType<SVGProps<SVGSVGElement>>;
}

export interface AuthRoute {
  path: string;
  name: string;
  element: React.ReactNode;
}

// We can add more interfaces here as needed, for example:
export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  dueDate?: Date;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Reward {
  id: string;
  name: string;
  points: number;
  description: string;
  achieved: boolean;
}
