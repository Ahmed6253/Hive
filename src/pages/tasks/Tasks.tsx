import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GroupCard, { Group } from "@/components/GroupCard";
import CreateGroupModal from "@/components/CreateGroupModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Icons } from "@/components/ui/icons";
import { Plus, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "@/lib/axios";

type Task = {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  status: string;
  difficulty: 1 | 2 | 3;
};

export default function Tasks() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [allCollapsed, setAllCollapsed] = useState(false);

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

  const { isLoading, error } = useQuery({
    queryKey: ["getTasks"],
    queryFn: getTasks,
    retry: true,
  });

  useEffect(() => {
    if (error) {
      toast.error("Failed to fetch tasks");
    }
  }, [error]);

  const addGroup = (g: Omit<Group, "id" | "tasks">) => {
    setGroups((p) => [{ id: `${Date.now()}`, tasks: [], ...g }, ...p]);
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

  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    groupId?: string;
    groupName?: string;
  }>({ show: false });

  const [showCreate, setShowCreate] = useState(false);

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Groups organize related tasks. Create groups and add tasks."
      >
        <div className="flex items-center justify-end gap-2 mb-4">
          {groups.length > 0 && (
            <Button
              variant="outline"
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
            onClick={() => setShowCreate(true)}
            title="New group"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-4">
        {isLoading ? (
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
        ) : groups.length === 0 && !isLoading ? (
          <div className="text-muted-foreground">
            No groups yet. Create one to get started.
          </div>
        ) : (
          groups.map((g) => (
            <GroupCard
              key={g.id}
              group={g}
              onAddTask={addTaskToGroup}
              onUpdateTask={updateTaskInGroup}
              defaultOpen={!allCollapsed}
              forceOpen={!allCollapsed}
              onDeleteTask={deleteTaskInGroup}
              onDeleteGroup={(groupId) => {
                const group = groups.find((g) => g.id === groupId);
                setDeleteConfirm({
                  show: true,
                  groupId,
                  groupName: group?.name,
                });
              }}
            />
          ))
        )}
      </div>

      <CreateGroupModal
        show={showCreate}
        toggleShow={() => setShowCreate(false)}
        onCreate={(g) => {
          if (!g.name) return;
          addGroup({
            name: g.name,
            description: g.description,
            icon: g.iconKey as keyof typeof Icons,
          });
          setShowCreate(false);
        }}
      />
      <ConfirmationDialog
        show={deleteConfirm.show}
        title="Delete Group"
        description={`Are you sure you want to delete "${deleteConfirm.groupName}"? All tasks in this group will also be deleted. This action cannot be undone.`}
        onConfirm={() => {
          if (deleteConfirm.groupId) {
            deleteGroup(deleteConfirm.groupId);
          }
          setDeleteConfirm({ show: false });
        }}
        onCancel={() => setDeleteConfirm({ show: false })}
      />
    </>
  );
}
