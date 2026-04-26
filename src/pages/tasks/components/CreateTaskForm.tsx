import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import SimpleSelect from "@/components/Select";
import { DatePickerDemo } from "@/components/ui/DatePickerDemo";
import { CheckIcon, X } from "lucide-react";
import { Task } from "@/types/tasks";

export default function CreateTaskForm({
  onAddTask,
  onCancel,
}: {
  onAddTask: (task: Task) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    dueDate: "",
    status: "not-started",
    difficulty: 2 as Task["difficulty"],
  });

  const selectedFormDate = form.dueDate
    ? new Date(`${form.dueDate}T00:00:00`)
    : undefined;

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
    onAddTask(newTask);
  };

  return (
    <div className="px-5 py-4 bg-muted/20 border-t border-border/50 border-dashed">
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2 items-end">
          <Input
            placeholder="Task name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
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
              { value: "not-started", label: "Not Started" },
              { value: "in-progress", label: "In Progress" },
              { value: "completed", label: "Completed" },
            ]}
            placeholder="Status"
            className="min-w-[130px] h-8"
          />
          <SimpleSelect
            size="sm"
            value={form.difficulty}
            onChange={(v) =>
              setForm({ ...form, difficulty: v as Task["difficulty"] })
            }
            options={[
              { value: 1, label: "Easy" },
              { value: 2, label: "Medium" },
              { value: 3, label: "Hard" },
            ]}
            placeholder="Difficulty"
            className="min-w-[110px]"
          />
          <div className="lg:flex hidden gap-2 ml-auto">
            <Button size={"icon-sm"} onClick={handleAdd} className="gap-2">
              <CheckIcon className="w-4 h-4" />
            </Button>
            <Button size={"icon-sm"} variant="secondary" onClick={onCancel}>
              <X />
            </Button>
          </div>
        </div>
        <Textarea
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="resize-none text-sm"
        />
        <div className="flex lg:hidden gap-2 ml-auto">
          <Button size={"icon-sm"} onClick={handleAdd} className="gap-2">
            <CheckIcon className="w-4 h-4" />
          </Button>
          <Button size={"icon-sm"} variant="secondary" onClick={onCancel}>
            <X />
          </Button>
        </div>
      </div>
    </div>
  );
}
