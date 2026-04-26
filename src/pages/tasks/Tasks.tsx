import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GroupCard, { Group } from "@/pages/tasks/components/GroupCard";
import CreateGroupModal from "@/pages/tasks/components/CreateGroupModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Icons } from "@/components/ui/icons";
import { Plus, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import toast from "react-hot-toast";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";
import { Task } from "@/types/tasks";

export default function Tasks() {
  const queryClient = useQueryClient();
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

  const firstIconKey = (Object.keys(Icons)[0] ?? "work") as keyof typeof Icons;
  const normalizeIcon = (icon?: string): keyof typeof Icons =>
    icon && icon in Icons ? (icon as keyof typeof Icons) : firstIconKey;

  const getTasks = async () => {
    try {
      const res = await axiosInstance.get("/tasks/get");
      setGroups(res?.data?.tasks);
      return res.data;
    } catch (error) {
      toast.error("Failed to fetch tasks");
      throw error;
    }
  };

  const { isFetching } = useQuery({
    queryKey: ["getTasks"],
    queryFn: getTasks,
    retry: true,
  });

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

  const getTaskById = (groupId: string, taskId: string) =>
    groups.find((g) => g.id === groupId)?.tasks.find((t) => t.id === taskId);

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    groupId?: string;
    groupName?: string;
  }>({ show: false });

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
    onError: (error) => {
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
    onError: (error) => {
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
    onError: (error) => {
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
    }) =>
      axiosInstance.post("/tasks/create", {
        name: payload.name,
        description: payload.description,
        dueDate: payload.dueDate,
        status: payload.status,
        difficulty: payload.difficulty,
        groupId,
      }),
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
    onError: (error) => {
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
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update task");
      queryClient.invalidateQueries({ queryKey: ["getTasks"] });
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
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to delete task");
    },
    onSettled: () => {
      setDeletingTask(null);
    },
  });

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Groups organize related tasks. Create groups and add tasks."
      >
        <div className="flex items-center justify-end gap-2 mb-4">
          {groups.length > 0 && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setAllCollapsed(!allCollapsed)}
              title={allCollapsed ? "Expand all" : "Collapse all"}
            >
              {allCollapsed ? (
                <ChevronsUpDown className="w-4 h-4 transition-transform duration-200" />
              ) : (
                <ChevronsDownUp className="w-4 h-4 transition-transform duration-200" />
              )}
            </Button>
          )}
          <Button
            size="icon"
            onClick={() => {
              setEditingGroup(null);
              setShowGroupModal(true);
            }}
            title="New group"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-4">
        {isFetching ? (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl shadow-md overflow-hidden opacity-50 "
              >
                <div className="px-3 py-2 flex items-center justify-between gap-2 bg-muted/30">
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="p-3 space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-sm" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        ) : groups?.length === 0 && !isFetching ? (
          <div className="text-muted-foreground">
            No groups yet. Create one to get started.
          </div>
        ) : (
          groups.map((g) => (
            <div
              key={g.id}
              className={
                g.id === newlyCreatedGroupId
                  ? "animate-in fade-in-0 slide-in-from-top-2 duration-300"
                  : g.id === removingGroupId
                    ? "animate-out fade-out-0 slide-out-to-top-2 duration-200 pointer-events-none"
                    : ""
              }
              onAnimationEnd={() => {
                if (g.id === newlyCreatedGroupId) {
                  setNewlyCreatedGroupId(null);
                }
                if (g.id === removingGroupId) {
                  deleteGroup(g.id);
                  setRemovingGroupId(null);
                }
              }}
            >
              <GroupCard
                group={g}
                onAddTask={(groupId, taskPayload) =>
                  createTaskMutation.mutate({ groupId, payload: taskPayload })
                }
                onUpdateTask={(groupId, taskId, patch) => {
                  updateTaskInGroup(groupId, taskId, patch);
                  updateTaskMutation.mutate({ groupId, taskId, patch });
                }}
                defaultOpen={!allCollapsed}
                forceOpen={!allCollapsed}
                onDeleteTask={(groupId, taskId) =>
                  deleteTaskMutation.mutate({ groupId, taskId })
                }
                isAddingTask={creatingTaskGroupId === g.id}
                deletingTaskId={
                  deletingTask?.groupId === g.id ? deletingTask.taskId : null
                }
                updatingTaskId={
                  updatingTask?.groupId === g.id ? updatingTask.taskId : null
                }
                removingTaskId={
                  removingTask?.groupId === g.id ? removingTask.taskId : null
                }
                newlyCreatedTaskId={
                  newlyCreatedTask?.groupId === g.id
                    ? newlyCreatedTask.taskId
                    : null
                }
                onTaskEntryAnimationEnd={(taskId) => {
                  if (
                    newlyCreatedTask &&
                    newlyCreatedTask.groupId === g.id &&
                    newlyCreatedTask.taskId === taskId
                  ) {
                    setNewlyCreatedTask(null);
                  }
                }}
                onTaskRemoveAnimationEnd={(taskId) => {
                  if (
                    removingTask &&
                    removingTask.groupId === g.id &&
                    removingTask.taskId === taskId
                  ) {
                    deleteTaskInGroup(g.id, taskId);
                    setRemovingTask(null);
                  }
                }}
                onDeleteGroup={(groupId) => {
                  const group = groups.find((g) => g.id === groupId);
                  setDeleteConfirm({
                    show: true,
                    groupId,
                    groupName: group?.name,
                  });
                }}
                onEditGroup={(group) => {
                  setEditingGroup(group);
                  setShowGroupModal(true);
                }}
                isDeletingGroup={deletingGroupId === g.id}
              />
            </div>
          ))
        )}
      </div>

      <CreateGroupModal
        show={showGroupModal}
        toggleShow={() => {
          setShowGroupModal(false);
          setEditingGroup(null);
        }}
        mode={editingGroup ? "edit" : "create"}
        isSubmitting={
          createGroupMutation.isPending || editGroupMutation.isPending
        }
        initialData={
          editingGroup
            ? {
                id: editingGroup.id,
                name: editingGroup.name,
                description: editingGroup.description,
                iconKey: editingGroup.icon,
              }
            : undefined
        }
        onSubmit={(g) => {
          if (!g.name) return;
          if (editingGroup) {
            editGroupMutation.mutate({
              groupId: editingGroup.id,
              payload: g,
            });
            return;
          }
          createGroupMutation.mutate(g);
        }}
      />
      <ConfirmationDialog
        show={deleteConfirm.show}
        isConfirming={deleteGroupMutation.isPending}
        title="Delete Group"
        description={`Are you sure you want to delete "${deleteConfirm.groupName}"? All tasks in this group will also be deleted. This action cannot be undone.`}
        onConfirm={() => {
          if (deleteConfirm.groupId) {
            deleteGroupMutation.mutate(deleteConfirm.groupId);
          }
        }}
        onCancel={() => {
          if (deleteGroupMutation.isPending) return;
          setDeleteConfirm({ show: false });
        }}
      />
    </>
  );
}
