import * as React from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import GroupCard, { Group } from "@/components/GroupCard";
import CreateGroupModal from "@/components/CreateGroupModal";
import { Icons } from "@/components/ui/icons";

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
  ) =>
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

  const [showCreate, setShowCreate] = React.useState(false);

  return (
    <>
      <PageHeader
        title="Tasks"
        description="Groups organize related tasks. Create groups and add tasks."
      />

      <div className="flex items-center justify-end mb-4">
        <Button onClick={() => setShowCreate(true)}>New Group</Button>
      </div>

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
    </>
  );
}
