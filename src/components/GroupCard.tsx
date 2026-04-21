import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import {
  ChevronDown,
  Plus,
  Trash2,
  Calendar,
  Minus,
  CheckIcon,
  X,
} from "lucide-react";
import ConfirmationDialog from "./ConfirmationDialog";
import { useEffect, useState } from "react";

type Task = {
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
    description: "",
    dueDate: "",
    status: "Not Started",
    difficulty: "Medium" as Task["difficulty"],
  });

  const reset = () =>
    setForm({
      name: "",
      description: "",
      dueDate: "",
      status: "Not Started",
      difficulty: "Medium",
    });

  const handleAdd = () => {
    if (!form.name) return;
    const newTask: Task = {
      id: `${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      name: form.name,
      description: form.description || undefined,
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
        <CollapsibleTrigger className="w-full px-3 py-2 flex items-center justify-between gap-2 bg-muted/30 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 text-base">
              {Icons[group.iconKey]}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm md:max-w-full max-w-[40%] truncate">
                  {group.name}
                </span>
                <span className="text-[10px] font-medium bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  {group.tasks.length}
                </span>
              </div>
              {group.description && (
                <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-1">
                  {group.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {group.tasks.length > 0 && (
              <div className="flex items-center gap-1.5">
                <div className="w-14 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {progressPercent}%
                </span>
              </div>
            )}
            {onDeleteGroup && (
              <Button
                variant="ghost"
                size="icon-xs"
                className="text-muted-foreground/60 hover:text-error"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteGroup(group.id);
                }}
              >
                <Minus className="w-3 h-3" />
              </Button>
            )}
            <ChevronDown
              className="w-3 h-3 opacity-40 transition-transform duration-300"
              style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
            />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div>
            {group.tasks.length === 0 ? (
              <div className="px-3 py-4 flex flex-col items-center justify-center gap-0.5">
                <p className="text-xs text-muted-foreground">No tasks</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3">
                {group.tasks.map((t) => {
                  const isDone = checked[t.id] || t.status === "Completed";
                  return (
                    <div
                      key={t.id}
                      className={`rounded-lg bg-background/50 shadow-sm p-3 flex flex-col gap-1.5 transition-all duration-200 hover:shadow-sm ${
                        isDone
                          ? "border-success/30 opacity-70"
                          : "border-border/50 hover:border-border"
                      }`}
                    >
                      <div className="flex items-start gap-1.5">
                        <Checkbox
                          aria-label="Mark complete"
                          checked={isDone}
                          onCheckedChange={() => checkedTasks(t.id)}
                          className={`mt-0.5 w-4  h-4 rounded-md border-1 shrink-0 flex items-center justify-center transition-all duration-200 ${
                            isDone
                              ? "bg-success border-success"
                              : "border-border hover:border-primary"
                          }`}
                        />
                        <div className="flex-1 min-w-0">
                          <span
                            className={`font-normal text-xs leading-snug transition-all block ${
                              isDone ? "line-through text-muted-foreground" : ""
                            }`}
                          >
                            {t.name}
                          </span>
                          {t.description && (
                            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                              {t.description}
                            </p>
                          )}
                        </div>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          className="text-muted-foreground/60 hover:text-error shrink-0 -mt-0.5 -mr-1"
                          onClick={() =>
                            setDeleteConfirm({
                              show: true,
                              taskId: t.id,
                              taskName: t.name,
                            })
                          }
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-auto">
                        <Select
                          value={t.status}
                          onValueChange={(v) =>
                            handleUpdateTask(t.id, {
                              status: v as Task["status"],
                            })
                          }
                        >
                          <SelectTrigger
                            className={`data-[size=default]:h-5 bg-transparent rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-2 border ${getStatusPillClass(
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
                            className={`data-[size=default]:h-5 rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-2 ${getDifficultyPillClass(
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
                        {t.dueDate && (
                          <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
                            <Calendar className="w-2.5 h-2.5" />
                            {formatDate(t.dueDate)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Add Task Form */}
            {showAddForm && (
              <div className="px-5 py-4 bg-muted/20 border-t border-border/50 border-dashed">
                <div className="flex flex-col gap-2">
                  <div className="flex flex-wrap gap-2 items-end">
                    <Input
                      placeholder="Task name"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="flex-1 h-8 min-w-[180px]"
                    />
                    <DatePickerDemo
                      className="w-44 h-8"
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
                      size="sm"
                      value={form.status}
                      onChange={(v) => setForm({ ...form, status: v })}
                      options={[
                        { value: "Not Started", label: "Not Started" },
                        { value: "In Progress", label: "In Progress" },
                        { value: "Completed", label: "Completed" },
                      ]}
                      placeholder="Status"
                      className="min-w-[130px] h-8"
                    />
                    <SimpleSelect
                      size="sm"
                      value={form.difficulty}
                      onChange={(v) =>
                        setForm({
                          ...form,
                          difficulty: v as Task["difficulty"],
                        })
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
                      <Button
                        size={"icon-sm"}
                        onClick={handleAdd}
                        className="gap-2"
                      >
                        <CheckIcon className="w-4 h-4" />
                      </Button>
                      <Button
                        size={"icon-sm"}
                        variant="outline"
                        onClick={() => {
                          reset();
                          setShowAddForm(false);
                        }}
                      >
                        <X />
                      </Button>
                    </div>
                  </div>
                  <Textarea
                    placeholder="Description (optional)"
                    value={form.description}
                    onChange={(e) =>
                      setForm({ ...form, description: e.target.value })
                    }
                    rows={2}
                    className="resize-none text-sm"
                  />
                </div>
              </div>
            )}
            {!showAddForm && (
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  setShowAddForm(true);
                }}
                className="w-full px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground rounded-b-lg border-t border-dashed border-border/30 hover:text-foreground bg-muted/20 hover:bg-muted/30 transition-all duration-200"
              >
                <Plus className="w-3 h-3" />
                Add task
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
