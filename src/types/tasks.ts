import { Icons } from "@/components/ui/icons";

export type Task = {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  status: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  iconKey: keyof typeof Icons;
  tasks: Task[];
};

export type ApiTask = {
  _id: string;
  name: string;
  description?: string;
  dueDate?: string;
  status: string;
  difficulty: number;
  groupId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  group: {
    _id: string;
    userId: string;
    name: string;
    description?: string;
    icon: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
};

export type TasksResponse = {
  success: boolean;
  message: string;
  tasks: Record<string, { name: string; tasks: ApiTask[] }>;
};