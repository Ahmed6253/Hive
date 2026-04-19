import * as React from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import GroupCard, { Group } from "@/components/GroupCard";
import CreateGroupModal from "@/components/CreateGroupModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Icons } from "@/components/ui/icons";
import { Plus, ChevronsDownUp, ChevronsUpDown } from "lucide-react";

type Task = {
  id: string;
  name: string;
  dueDate?: string;
  status: string;
  difficulty: "Easy" | "Medium" | "Hard";
};

export default function Tasks() {
  const [groups, setGroups] = React.useState<Group[]>(() => {
    try {
      const raw = localStorage.getItem("hive_groups");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [allCollapsed, setAllCollapsed] = React.useState(false);

  React.useEffect(() => {
    try {
      localStorage.setItem("hive_groups", JSON.stringify(groups));
    } catch {}
  }, [groups]);

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

  const [deleteConfirm, setDeleteConfirm] = React.useState<{
    show: boolean;
    groupId?: string;
    groupName?: string;
  }>({ show: false });

  const [showCreate, setShowCreate] = React.useState(false);

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Groups organize related tasks. Create groups and add tasks."
      >
        <div className="flex items-center justify-end gap-2 mb-4">
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
          <Button
            size="icon"
            onClick={() => setShowCreate(true)}
            title="New group"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </PageHeader>

      <div className="grid gap-4">
        {groups.length === 0 ? (
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
              tasks={g.tasks}
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
            iconKey: g.iconKey as keyof typeof Icons,
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
