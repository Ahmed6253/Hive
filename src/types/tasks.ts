import { Icons } from "@/components/ui/icons";

export type Task = {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  status: string;
  difficulty: 1 | 2 | 3;
  sortOrder?: number;
};

export type Group = {
  id: string;
  name: string;
  description?: string;
  icon: keyof typeof Icons;
  tasks: Task[];
  onDeleteTask?: (groupId: string, taskId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  decription?: string;
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
