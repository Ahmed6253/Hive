import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/ui/icons";
import SimpleSelect from "@/components/Select";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePickerDemo } from "@/components/ui/DatePickerDemo";
import { ChevronDown, Plus, Trash2, Calendar, Minus } from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  name: string;
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
  onDeleteTask?: (groupId: string, taskId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
};

function formatDate(raw?: string) {
  if (!raw) return null;
  const d = new Date(raw);
  if (isNaN(d.getTime())) return raw;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getStatusPillClass(status: string) {
  if (status === "Completed") return "border-success/60 text-success";
  if (status === "In Progress") return "border-alert/60 text-alert";
  return "border-secondary/40 text-secondary";
}

function getDifficultyPillClass(difficulty: Task["difficulty"]) {
  if (difficulty === "Easy") {
    return "border-transparent bg-success text-white focus-visible:border-success";
  }
  if (difficulty === "Medium") {
    return "border-transparent bg-alert text-white focus-visible:border-alert";
  }
  return "border-transparent bg-error text-white focus-visible:border-error";
}

export default function GroupCard({
  group,
  onAddTask,
  onUpdateTask,
  defaultOpen = true,
  forceOpen,
  onDeleteTask,
  onDeleteGroup,
  tasks,
}: {
  group: Group;
  onAddTask: (groupId: string, task: Task) => void;
  onUpdateTask: (groupId: string, taskId: string, patch: Partial<Task>) => void;
  onDeleteTask?: (groupId: string, taskId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  defaultOpen?: boolean;
  forceOpen?: boolean;
  tasks: Task[];
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (forceOpen !== undefined) {
      setOpen(forceOpen);
    }
  }, [forceOpen]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    taskId?: string;
    taskName?: string;
  }>({ show: false });
  const [checked, setChecked] = useState<Record<string, boolean>>({
    ...tasks.reduce(
      (acc, t) => {
        if (t.status === "Completed") {
          acc[t.id] = true;
        }
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  });

  const completedCount = group.tasks.filter(
    (t) => checked[t.id] || t.status === "Completed",
  ).length;
  const progressPercent =
    group.tasks.length > 0
      ? Math.round((completedCount / group.tasks.length) * 100)
      : 0;

  const [form, setForm] = useState({
    name: "",
    dueDate: "",
    status: "Not Started",
    difficulty: "Medium" as Task["difficulty"],
  });

  const reset = () =>
    setForm({
      name: "",
      dueDate: "",
      status: "Not Started",
      difficulty: "Medium",
    });

  const handleAdd = () => {
    if (!form.name) return;
    const newTask: Task = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name: form.name,
      dueDate: form.dueDate,
      status: form.status,
      difficulty: form.difficulty,
    };
    onAddTask(group.id, newTask);
    reset();
    setShowAddForm(false);
  };

  const handleUpdateTask = (taskId: string, patch: Partial<Task>) => {
    if (patch.status === "Completed") {
      setChecked((p) => ({ ...p, [taskId]: true }));
    } else {
      setChecked((p) => {
        const copy = { ...p };
        delete copy[taskId];
        return copy;
      });
    }
    onUpdateTask(group.id, taskId, patch);
  };

  const checkedTasks = (taskId: string) => {
    if (checked[taskId]) {
      setChecked((p) => {
        const copy = { ...p };
        delete copy[taskId];
        return copy;
      });

      onUpdateTask(group.id, taskId, { status: "Not Started" });
    } else {
      setChecked((p) => ({ ...p, [taskId]: true }));
      onUpdateTask(group.id, taskId, { status: "Completed" });
    }
  };

  const selectedFormDate = form.dueDate
    ? new Date(`${form.dueDate}T00:00:00`)
    : undefined;

  return (
    <div className="bg-card rounded-2xl shadow-md overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        {/* Group Header */}
        <CollapsibleTrigger className="w-full px-5 py-4 flex items-center justify-between gap-3 bg-muted/30 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 text-lg">
              {Icons[group.iconKey]}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-base md:max-w-full max-w-[40%] truncate">
                  {group.name}
                </span>
                <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                  {group.tasks.length}{" "}
                  {group.tasks.length === 1 ? "task" : "tasks"}
                </span>
              </div>
              {group.description && (
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {group.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            {group.tasks.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-7 overflow-hidden text-muted-foreground">
                  {progressPercent}%
                </span>
              </div>
            )}
            {onDeleteGroup && (
              <Button
                variant="ghost"
                size="icon-sm"
                className="text-muted-foreground hover:text-error h-8 w-8"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGroup(group.id);
                }}
              >
                <Minus className="w-4 h-4" />
              </Button>
            )}
            <ChevronDown
              className="w-4 h-4 opacity-40 transition-transform duration-300"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </div>
        </CollapsibleTrigger>

        {/* Task List */}
        <CollapsibleContent>
          <div>
            {group.tasks.length === 0 ? (
              <div className="px-5 py-5 flex flex-col items-center justify-center">
                <p className="text-sm text-muted-foreground">No tasks yet</p>

                <p className="text-xs text-muted-foreground/70 mt-1">
                  Add a task to get started
                </p>
              </div>
            ) : (
              group.tasks.map((t) => (
                <div
                  key={t.id}
                  className={`px-5 py-3 flex items-center gap-4 transition-all duration-200 hover:bg-muted/10 `}
                >
                  <Checkbox
                    aria-label="Mark complete"
                    checked={checked[t.id] || t.status === "Completed"}
                    onCheckedChange={() => checkedTasks(t.id)}
                    className={`w-5 h-5 rounded-lg border-2 shrink-0 flex items-center justify-center transition-all duration-200 ${
                      checked[t.id] || t.status === "Completed"
                        ? "bg-success border-success scale-110"
                        : "border-border hover:border-primary"
                    }`}
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`font-medium text-sm truncate transition-all ${
                          checked[t.id] || t.status === "Completed"
                            ? "line-through text-muted-foreground"
                            : ""
                        }`}
                      >
                        {t.name}
                      </span>
                      <Select
                        value={t.status}
                        onValueChange={(v) =>
                          handleUpdateTask(t.id, {
                            status: v as Task["status"],
                          })
                        }
                      >
                        <SelectTrigger
                          className={`data-[size=default]:h-6 bg-transparent rounded-lg px-2 py-0.5 text-[11px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-3 ${getStatusPillClass(
                            t.status,
                          )}`}
                          iconColor={getStatusPillClass(t.status)}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Not Started">
                            Not Started
                          </SelectItem>
                          <SelectItem value="In Progress">
                            In Progress
                          </SelectItem>
                          <SelectItem value="Completed">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select
                        value={t.difficulty}
                        onValueChange={(v) =>
                          handleUpdateTask(t.id, {
                            difficulty: v as Task["difficulty"],
                          })
                        }
                      >
                        <SelectTrigger
                          className={`data-[size=default]:h-6 bg-transparent rounded-lg px-2 py-0.5 text-[11px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-3 ${getDifficultyPillClass(
                            t.difficulty,
                          )}`}
                          iconColor={getDifficultyPillClass(t.difficulty)}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Easy">Easy</SelectItem>
                          <SelectItem value="Medium">Medium</SelectItem>
                          <SelectItem value="Hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {t.dueDate && (
                      <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Due {formatDate(t.dueDate)}
                      </p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    className="text-muted-foreground hover:text-error hov shrink-0"
                    onClick={() => {
                      setDeleteConfirm({
                        show: true,
                        taskId: t.id,
                        taskName: t.name,
                      });
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))
            )}

            {/* Add Task Form */}
            {showAddForm && (
              <div className="px-5 py-4 bg-muted/20 border-t border-border/50 border-dashed">
                <div className="flex flex-wrap gap-3 items-end">
                  <Input
                    placeholder="Task name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="flex-1 min-w-[180px]"
                  />
                  <DatePickerDemo
                    className="w-44"
                    value={selectedFormDate}
                    onChange={(date) => {
                      if (!date) {
                        setForm({ ...form, dueDate: "" });
                        return;
                      }
                      const y = date.getFullYear();
                      const m = String(date.getMonth() + 1).padStart(2, "0");
                      const d = String(date.getDate()).padStart(2, "0");
                      setForm({ ...form, dueDate: `${y}-${m}-${d}` });
                    }}
                  />
                  <SimpleSelect
                    value={form.status}
                    onChange={(v) => setForm({ ...form, status: v })}
                    options={[
                      { value: "Not Started", label: "Not Started" },
                      { value: "In Progress", label: "In Progress" },
                      { value: "Completed", label: "Completed" },
                    ]}
                    placeholder="Status"
                    className="min-w-[130px]"
                  />
                  <SimpleSelect
                    value={form.difficulty}
                    onChange={(v) =>
                      setForm({ ...form, difficulty: v as Task["difficulty"] })
                    }
                    options={[
                      { value: "Easy", label: "Easy" },
                      { value: "Medium", label: "Medium" },
                      { value: "Hard", label: "Hard" },
                    ]}
                    placeholder="Difficulty"
                    className="min-w-[110px]"
                  />
                  <div className="flex gap-2 ml-auto">
                    <Button onClick={handleAdd} className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Task
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        reset();
                        setShowAddForm(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Add Task Button */}
            {!showAddForm && (
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  setShowAddForm(true);
                }}
                className="w-full px-5 py-3 flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground rounded-b-2xl border-2 border-dashed border-background/20 hover:text-foreground bg-muted/30 hover:bg-background/30 transition-all duration-200"
              >
                <Plus className="w-4 h-4" />
                Add new task
              </button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
      <ConfirmationDialog
        show={deleteConfirm.show}
        title="Delete Task"
        description={`Are you sure you want to delete "${deleteConfirm.taskName}"? This action cannot be undone.`}
        onConfirm={() => {
          if (deleteConfirm.taskId && onDeleteTask) {
            onDeleteTask(group.id, deleteConfirm.taskId);
          }
          setDeleteConfirm({ show: false });
        }}
        onCancel={() => setDeleteConfirm({ show: false })}
      />
    </div>
  );
}
