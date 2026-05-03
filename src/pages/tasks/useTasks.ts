import { useState, useCallback } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "@/lib/axios";
import { Icons } from "@/components/ui/icons";
import { Task } from "@/types/tasks";
import { Group } from "./components/GroupCard";
import type { Error } from "@/types";

const firstIconKey = (Object.keys(Icons)[0] ?? "work") as keyof typeof Icons;
const normalizeIcon = (icon?: string): keyof typeof Icons =>
  icon && icon in Icons ? (icon as keyof typeof Icons) : firstIconKey;

const isPastDueDate = (dueDate?: string) => {
  if (!dueDate) return false;
  const selected = new Date(`${dueDate}T00:00:00`);
  if (Number.isNaN(selected.getTime())) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return selected < today;
};

export function useTasks() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [allCollapsed, setAllCollapsed] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [newlyCreatedGroupId, setNewlyCreatedGroupId] = useState<string | null>(
    null,
  );
  const [removingGroupId, setRemovingGroupId] = useState<string | null>(null);
  const [deletingGroupId, setDeletingGroupId] = useState<string | null>(null);
  const [creatingTaskGroupId, setCreatingTaskGroupId] = useState<string | null>(
    null,
  );
  const [newlyCreatedTask, setNewlyCreatedTask] = useState<{
    groupId: string;
    taskId: string;
  } | null>(null);
  const [deletingTask, setDeletingTask] = useState<{
    groupId: string;
    taskId: string;
  } | null>(null);
  const [updatingTask, setUpdatingTask] = useState<{
    groupId: string;
    taskId: string;
  } | null>(null);
  const [removingTask, setRemovingTask] = useState<{
    groupId: string;
    taskId: string;
  } | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    groupId?: string;
    groupName?: string;
  }>({ show: false });

  const addGroup = (g: Group) => {
    setGroups((p) => [{ ...g }, ...p]);
  };

  const updateGroup = (groupId: string, patch: Partial<Group>) => {
    setGroups((p) =>
      p.map((g) => (g.id === groupId ? { ...g, ...patch, tasks: g.tasks } : g)),
    );
  };

  const addTaskToGroup = (groupId: string, task: Task) =>
    setGroups((p) =>
      p.map((g) =>
        g.id === groupId ? { ...g, tasks: [...g.tasks, task] } : g,
      ),
    );

  const updateTaskInGroup = (
    groupId: string,
    taskId: string,
    patch: Partial<Task>,
  ) => {
    setGroups((p) =>
      p.map((g) =>
        g.id === groupId
          ? {
              ...g,
              tasks: g.tasks.map((t) =>
                t.id === taskId ? { ...t, ...patch } : t,
              ),
            }
          : g,
      ),
    );
  };

  const deleteTaskInGroup = (groupId: string, taskId: string) => {
    setGroups((p) =>
      p.map((g) =>
        g.id === groupId
          ? { ...g, tasks: g.tasks.filter((t) => t.id !== taskId) }
          : g,
      ),
    );
  };

  const deleteGroup = (groupId: string) => {
    setGroups((p) => p.filter((g) => g.id !== groupId));
  };

  const applyMove = (
    prev: Group[],
    activeTaskId: string,
    activeGroupId: string,
    overGroupId: string,
    overTaskId?: string,
  ): Group[] => {
    const activeGroup = prev.find((g) => g.id === activeGroupId);
    const task = activeGroup?.tasks.find((t) => t.id === activeTaskId);
    if (!task) return prev;

    const overGroup = prev.find((g) => g.id === overGroupId);
    if (!overGroup) return prev;

    if (activeGroupId === overGroupId) {
      const overIndex = overGroup.tasks.findIndex((t) => t.id === overTaskId);
      if (overIndex === -1) return prev;
      const taskIndex = overGroup.tasks.findIndex((t) => t.id === activeTaskId);
      if (taskIndex === -1) return prev;
      const newTasks = [...overGroup.tasks];
      const [moved] = newTasks.splice(taskIndex, 1);
      newTasks.splice(overIndex, 0, moved);
      return prev.map((g) =>
        g.id === overGroupId ? { ...g, tasks: newTasks } : g,
      );
    }

    const overIndex = overTaskId
      ? overGroup.tasks.findIndex((t) => t.id === overTaskId)
      : overGroup.tasks.length;
    const newActiveTasks = activeGroup!.tasks.filter(
      (t) => t.id !== activeTaskId,
    );
    const newOverTasks = [...overGroup.tasks];
    newOverTasks.splice(
      overIndex === -1 ? newOverTasks.length : overIndex,
      0,
      task,
    );
    return prev.map((g) => {
      if (g.id === activeGroupId) return { ...g, tasks: newActiveTasks };
      if (g.id === overGroupId) return { ...g, tasks: newOverTasks };
      return g;
    });
  };

  const moveTask = (
    activeTaskId: string,
    activeGroupId: string,
    overGroupId: string,
    overTaskId?: string,
  ): Group[] => {
    const newGroups = applyMove(groups, activeTaskId, activeGroupId, overGroupId, overTaskId);
    setGroups(newGroups);
    return newGroups;
  };

  const sortTasksMutation = useMutation({
    mutationFn: async (items: { id: string; sortOrder: number }[]) =>
      axiosInstance.put("/tasks/sort", items),
    onError: () => {
      toast.error("Failed to save task order");
    },
  });

  const persistSortOrder = useCallback((currentGroups: Group[], groupIds: string[]) => {
    const items = currentGroups
      .filter((g) => groupIds.includes(g.id))
      .flatMap((g) =>
        g.tasks.map((t, index) => ({ id: t.id, sortOrder: index })),
      );
    if (items.length > 0) {
      sortTasksMutation.mutate(items);
    }
  }, []);

  const getTaskById = (groupId: string, taskId: string) =>
    groups.find((g) => g.id === groupId)?.tasks.find((t) => t.id === taskId);

  const { isFetching } = useQuery({
    queryKey: ["getTasks"],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get("/tasks/get");
        setGroups(res?.data?.tasks);
        return res.data;
      } catch (error) {
        toast.error("Failed to fetch tasks");
        throw error;
      }
    },
  });

  const createGroupMutation = useMutation({
    mutationFn: async (payload: {
      name: string;
      description?: string;
      iconKey: string;
    }) =>
      axiosInstance.post("/groups/create", {
        name: payload.name,
        description: payload.description,
        icon: payload.iconKey,
      }),
    onSuccess: (res) => {
      const createdGroup = res?.data?.group;
      if (!createdGroup?._id) {
        toast.error("Failed to create group");
        return;
      }
      addGroup({
        id: createdGroup._id,
        name: createdGroup.name,
        description: createdGroup.description,
        icon: normalizeIcon(createdGroup.icon),
        tasks: [],
      });
      setNewlyCreatedGroupId(createdGroup._id);
      toast.success("Group created successfully");
      setShowGroupModal(false);
    },
    onError: (error: Error) => {
      toast.error(error?.response?.data?.message || "Failed to create group");
    },
  });

  const editGroupMutation = useMutation({
    mutationFn: async ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: { name: string; description?: string; iconKey: string };
    }) =>
      axiosInstance.put("/groups/edit", {
        id: groupId,
        name: payload.name,
        description: payload.description,
        icon: payload.iconKey,
      }),
    onSuccess: (res, variables) => {
      const updatedGroup = res?.data?.group;
      if (!updatedGroup?._id) {
        toast.error("Failed to update group");
        return;
      }
      updateGroup(variables.groupId, {
        name: updatedGroup.name,
        description: updatedGroup.description,
        icon: normalizeIcon(updatedGroup.icon),
      });
      toast.success("Group updated successfully");
      setShowGroupModal(false);
      setEditingGroup(null);
    },
    onError: (error: Error) => {
      toast.error(error?.response?.data?.message || "Failed to update group");
    },
  });

  const deleteGroupMutation = useMutation({
    onMutate: (groupId) => {
      setDeletingGroupId(groupId);
    },
    mutationFn: async (groupId: string) =>
      axiosInstance.delete("/groups/delete", {
        data: { id: groupId },
      }),
    onSuccess: (res, groupId) => {
      setDeleteConfirm({ show: false });
      setRemovingGroupId(groupId);
      toast.success(res.data.data.message);
    },
    onError: (error: Error) => {
      toast.error(error?.response?.data?.message || "Failed to delete group");
    },
    onSettled: () => {
      setDeletingGroupId(null);
    },
  });

  const createTaskMutation = useMutation({
    onMutate: ({ groupId }) => {
      setCreatingTaskGroupId(groupId);
    },
    mutationFn: async ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: Omit<Task, "id">;
    }) => {
      if (isPastDueDate(payload.dueDate)) {
        throw new Error("Due date cannot be before current date");
      }
      return axiosInstance.post("/tasks/create", {
        name: payload.name,
        description: payload.description,
        dueDate: payload.dueDate,
        status: payload.status,
        difficulty: payload.difficulty,
        groupId,
      });
    },
    onSuccess: (res, variables) => {
      const createdTask = res?.data?.task;
      if (!createdTask?._id) {
        toast.error("Failed to create task");
        return;
      }
      addTaskToGroup(variables.groupId, {
        id: createdTask._id,
        name: createdTask.name,
        description: createdTask.description,
        dueDate: createdTask.dueDate,
        status: createdTask.status,
        difficulty: createdTask.difficulty,
      });
      setNewlyCreatedTask({
        groupId: variables.groupId,
        taskId: createdTask._id,
      });
      toast.success("Task created successfully");
    },
    onError: (error: Error) => {
      toast.error(error?.response?.data?.message || "Failed to create task");
    },
    onSettled: () => {
      setCreatingTaskGroupId(null);
    },
  });

  const updateTaskMutation = useMutation({
    onMutate: ({ groupId, taskId }) => {
      setUpdatingTask({ groupId, taskId });
    },
    mutationFn: async ({
      groupId,
      taskId,
      patch,
    }: {
      groupId: string;
      taskId: string;
      patch: Partial<Task>;
    }) => {
      const current = getTaskById(groupId, taskId);
      if (!current) throw new Error("Task not found");
      const nextTask = { ...current, ...patch };
      return axiosInstance.put("/tasks/edit", {
        id: taskId,
        groupId,
        name: nextTask.name,
        description: nextTask.description,
        dueDate: nextTask.dueDate,
        status: nextTask.status,
        difficulty: nextTask.difficulty,
      });
    },
    onSuccess: (res, variables) => {
      const updatedTask = res?.data?.task;
      updateTaskInGroup(variables.groupId, variables.taskId, updatedTask);
      toast.success("Task updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error?.response?.data?.message || "Failed to update task");
    },
    onSettled: () => {
      setUpdatingTask(null);
    },
  });

  const deleteTaskMutation = useMutation({
    onMutate: ({ groupId, taskId }) => {
      setDeletingTask({ groupId, taskId });
    },
    mutationFn: async ({
      groupId,
      taskId,
    }: {
      groupId: string;
      taskId: string;
    }) =>
      axiosInstance.delete("/tasks/delete", {
        data: { id: taskId, groupId },
      }),
    onSuccess: (_, variables) => {
      setRemovingTask({ groupId: variables.groupId, taskId: variables.taskId });
      toast.success("Task deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error?.response?.data?.message || "Failed to delete task");
    },
    onSettled: () => {
      setDeletingTask(null);
    },
  });

  const addTask = async (groupId: string, taskPayload: Omit<Task, "id">) => {
    try {
      await createTaskMutation.mutateAsync({ groupId, payload: taskPayload });
      return true;
    } catch {
      return false;
    }
  };

  const handleDeleteGroup = (groupId: string) => {
    const group = groups.find((g) => g.id === groupId);
    setDeleteConfirm({
      show: true,
      groupId,
      groupName: group?.name,
    });
  };

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setShowGroupModal(true);
  };

  const openNewGroupModal = () => {
    setEditingGroup(null);
    setShowGroupModal(true);
  };

  const closeGroupModal = () => {
    setShowGroupModal(false);
    setEditingGroup(null);
  };

  const submitGroupModal = (g: {
    name: string;
    description?: string;
    iconKey: string;
  }) => {
    if (!g.name) return;
    if (editingGroup) {
      editGroupMutation.mutate({
        groupId: editingGroup.id,
        payload: g,
      });
      return;
    }
    createGroupMutation.mutate(g);
  };

  const confirmDeleteGroup = () => {
    if (deleteConfirm.groupId) {
      deleteGroupMutation.mutate(deleteConfirm.groupId);
    }
  };

  const cancelDeleteGroup = () => {
    if (deleteGroupMutation.isPending) return;
    setDeleteConfirm({ show: false });
  };

  const handleGroupAnimationEnd = (groupId: string) => {
    if (groupId === newlyCreatedGroupId) {
      setNewlyCreatedGroupId(null);
    }
    if (groupId === removingGroupId) {
      deleteGroup(groupId);
      setRemovingGroupId(null);
    }
  };

  const handleTaskEntryAnimationEnd = (groupId: string, taskId: string) => {
    if (
      newlyCreatedTask &&
      newlyCreatedTask.groupId === groupId &&
      newlyCreatedTask.taskId === taskId
    ) {
      setNewlyCreatedTask(null);
    }
  };

  const handleTaskRemoveAnimationEnd = (groupId: string, taskId: string) => {
    if (
      removingTask &&
      removingTask.groupId === groupId &&
      removingTask.taskId === taskId
    ) {
      deleteTaskInGroup(groupId, taskId);
      setRemovingTask(null);
    }
  };

  return {
    groups,
    isFetching,
    allCollapsed,
    setAllCollapsed,
    showGroupModal,
    editingGroup,
    newlyCreatedGroupId,
    removingGroupId,
    deletingGroupId,
    creatingTaskGroupId,
    newlyCreatedTask,
    deletingTask,
    updatingTask,
    removingTask,
    deleteConfirm,
    createGroupMutation,
    editGroupMutation,
    deleteGroupMutation,
    createTaskMutation,
    updateTaskMutation,
    deleteTaskMutation,
    addTask,
    handleDeleteGroup,
    handleEditGroup,
    openNewGroupModal,
    closeGroupModal,
    submitGroupModal,
    confirmDeleteGroup,
    cancelDeleteGroup,
    handleGroupAnimationEnd,
    handleTaskEntryAnimationEnd,
    handleTaskRemoveAnimationEnd,
    moveTask,
    persistSortOrder,
    sortTasksMutation,
  };
}
