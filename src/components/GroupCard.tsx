import * as React from "react";
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
import {
  Check,
  ChevronDown,
  ChevronUp,
  PanelTopClose,
  Plus,
  X,
} from "lucide-react";

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
}: {
  group: Group;
  onAddTask: (groupId: string, task: Task) => void;
  onUpdateTask: (groupId: string, taskId: string, patch: Partial<Task>) => void;
}) {
  const [open, setOpen] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [checked, setChecked] = React.useState<Record<string, boolean>>({});

  const [form, setForm] = React.useState({
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

  const selectedFormDate = form.dueDate
    ? new Date(`${form.dueDate}T00:00:00`)
    : undefined;

  return (
    <div className="bg-card rounded-xl  shadow-sm">
      <Collapsible open={open} onOpenChange={setOpen}>
        {/* ── Group header ── */}
        <CollapsibleTrigger className="w-full px-5 py-4 flex items-center justify-between gap-3  transition-colors">
          <div className="flex items-center gap-3">
            {/* Icon */}
            <div className="w-8 h-8 rounded bg-muted flex items-center justify-center shrink-0 text-base">
              {Icons[group.iconKey]}
            </div>
            <span className="font-semibold text-base">{group.name}</span>
            <span className="text-xs font-semibold bg-secondary/30 text-secondary px-2 py-0.5 rounded-full">
              {group.tasks.length}
            </span>
          </div>
          <ChevronDown
            className="w-4 h-4 opacity-50 transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
        </CollapsibleTrigger>

        {/* ── Task rows ── */}
        <CollapsibleContent>
          <div className="divide-y divide-cont-color">
            {group.tasks.length === 0 ? (
              <div className="px-5 py-4 text-sm text-secondary">
                No tasks yet.
              </div>
            ) : (
              group.tasks.map((t) => (
                <div
                  key={t.id}
                  className="px-5 py-3 flex items-center gap-4 hover:bg-cont-color transition-colors"
                >
                  {/* Name + tags + due date */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium text-sm truncate">
                        {t.name}
                      </span>
                      <Select
                        value={t.status}
                        onValueChange={(v) =>
                          onUpdateTask(group.id, t.id, { status: v })
                        }
                      >
                        <SelectTrigger
                          className={`data-[size=default]:h-6 bg-transparent rounded-full px-2 py-0.5 text-[11px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-3 [&_svg:not([class*='text-'])]:text-current ${getStatusPillClass(t.status)}`}
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
                          onUpdateTask(group.id, t.id, {
                            difficulty: v as Task["difficulty"],
                          })
                        }
                      >
                        <SelectTrigger
                          className={`data-[size=default]:h-6 bg-transparent rounded-full px-2 py-0.5 text-[11px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-3 [&_svg:not([class*='text-'])]:text-current ${getDifficultyPillClass(t.difficulty)}`}
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
                      <p className="text-xs text-secondary mt-0.5">
                        Due {formatDate(t.dueDate)}
                      </p>
                    )}
                  </div>

                  <Checkbox
                    aria-label="Mark complete"
                    checked={!!checked[t.id]}
                    onCheckedChange={(val) =>
                      setChecked((p) => ({ ...p, [t.id]: Boolean(val) }))
                    }
                    className={`w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${
                      checked[t.id]
                        ? "bg-success border-success"
                        : "border-secondary/40 hover:border-primary"
                    }`}
                  />
                </div>
              ))
            )}

            {/* ── Add task form ── */}
            {showAddForm && (
              <div className="px-5 py-3 flex flex-wrap gap-2 items-end bg-cont-color/50 rounded-b-xl">
                <Input
                  placeholder="Task name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="flex-1 min-w-[180px]"
                />
                <div>
                  <DatePickerDemo
                    className="w-40 "
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
                </div>
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
                  <Button size="icon-sm" onClick={handleAdd}>
                    <Plus />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => {
                      reset();
                      setShowAddForm(false);
                    }}
                  >
                    <ChevronUp />
                  </Button>
                </div>
              </div>
            )}

            {/* ── Add task button ── */}
            {!showAddForm && (
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  setShowAddForm(true);
                }}
                className="w-full px-5 py-3 rounded-b-xl flex items-center justify-center gap-2 text-sm text-secondary hover:text-text hover:bg-cont-color transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add task
              </button>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
