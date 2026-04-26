import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerDemo } from "@/components/ui/DatePickerDemo";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Task } from "@/types/tasks";

export default function TaskDetailsModal({
  show,
  toggleShow,
  task,
  onUpdateTask,
}: {
  show: boolean;
  toggleShow: () => void;
  task: Task | null;
  onUpdateTask: (taskId: string, patch: Partial<Task>) => void;
}) {
  const [localTask, setLocalTask] = useState<Task | null>(task);
  const [editingName, setEditingName] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);

  useEffect(() => {
    setLocalTask(task);
    setEditingName(false);
    setEditingDescription(false);
  }, [task, show]);

  const updatePatch = (patch: Partial<Task>) => {
    if (!localTask) return;
    const nextTask = { ...localTask, ...patch };
    setLocalTask(nextTask);
    onUpdateTask(localTask.id, patch);
  };

  if (!localTask) return null;

  const parsedDate = localTask.dueDate
    ? new Date(localTask.dueDate)
    : undefined;
  const selectedDate =
    parsedDate && !Number.isNaN(parsedDate.getTime()) ? parsedDate : undefined;

  return (
    <Modal
      className="w-[680px]"
      show={show}
      toggleShow={toggleShow}
      title="Task details"
    >
      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Name</p>
          {editingName ? (
            <Input
              autoFocus
              value={localTask.name}
              onChange={(e) =>
                setLocalTask((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev,
                )
              }
              onBlur={() => {
                const next = localTask.name.trim();
                if (next && next !== task?.name) {
                  updatePatch({ name: next });
                } else if (task?.name && next !== task.name) {
                  setLocalTask((prev) =>
                    prev ? { ...prev, name: task.name } : prev,
                  );
                }
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  (e.currentTarget as HTMLInputElement).blur();
                }
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingName(true)}
              className="w-full text-left rounded-md px-2 py-1.5 hover:bg-muted/40 text-sm"
            >
              {localTask.name}
            </button>
          )}
        </div>

        <div>
          <p className="text-xs text-muted-foreground mb-1">Description</p>
          {editingDescription ? (
            <Textarea
              autoFocus
              rows={6}
              className="resize-none"
              value={localTask.description ?? ""}
              onChange={(e) =>
                setLocalTask((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev,
                )
              }
              onBlur={() => {
                const next = localTask.description ?? "";
                if ((task?.description ?? "") !== next) {
                  updatePatch({ description: next || undefined });
                }
                setEditingDescription(false);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingDescription(true)}
              className="w-full text-left rounded-md px-2 py-2 hover:bg-muted/40 text-sm min-h-24"
            >
              {localTask.description || (
                <span className="text-muted-foreground">Add description</span>
              )}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Status</p>
            <Select
              value={localTask.status}
              onValueChange={(status) =>
                updatePatch({ status: status as Task["status"] })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="not-started">Not Started</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Difficulty</p>
            <Select
              value={localTask.difficulty}
              onValueChange={(difficulty) =>
                updatePatch({ difficulty: difficulty as Task["difficulty"] })
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={1}>Easy</SelectItem>
                <SelectItem value={2}>Medium</SelectItem>
                <SelectItem value={3}>Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Due date</p>
            <DatePickerDemo
              className="w-full"
              value={selectedDate}
              onChange={(date) => {
                if (!date) {
                  updatePatch({ dueDate: undefined });
                  return;
                }
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, "0");
                const d = String(date.getDate()).padStart(2, "0");
                updatePatch({ dueDate: `${y}-${m}-${d}` });
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
