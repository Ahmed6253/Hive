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

  const closeWithSave = () => {
    if (!localTask || !task) {
      toggleShow();
      return;
    }

    const nextName = localTask.name.trim() || task.name;
    const nextDescription = localTask.description || undefined;
    const patch: Partial<Task> = {};

    if (nextName !== task.name) patch.name = nextName;
    if (nextDescription !== (task.description || undefined)) {
      patch.description = nextDescription;
    }
    if (localTask.status !== task.status) patch.status = localTask.status;
    if (localTask.difficulty !== task.difficulty) {
      patch.difficulty = localTask.difficulty;
    }
    if ((localTask.dueDate || undefined) !== (task.dueDate || undefined)) {
      patch.dueDate = localTask.dueDate || undefined;
    }

    if (Object.keys(patch).length > 0) {
      onUpdateTask(localTask.id, patch);
    }

    setEditingName(false);
    setEditingDescription(false);
    toggleShow();
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
      toggleShow={closeWithSave}
      title="Task details"
    >
      <div className="space-y-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Name</p>
          {editingName ? (
            <Input
              className="border-0 focus-visible:ring-0 px-2 mt-0 py-1.5 bg-muted/40"
              autoFocus
              value={localTask.name}
              onChange={(e) =>
                setLocalTask((prev) =>
                  prev ? { ...prev, name: e.target.value } : prev,
                )
              }
              onBlur={() => {
                const next = localTask.name.trim();
                if (next) {
                  setLocalTask((prev) =>
                    prev ? { ...prev, name: next } : prev,
                  );
                } else if (task?.name) {
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
              className="w-full text-left rounded-md px-2 py-2 text-sm cursor-pointer"
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
              className="resize-none border-0 min-h-fit px-2 focus-visible:ring-0 bg-muted/40"
              value={localTask.description ?? ""}
              onChange={(e) =>
                setLocalTask((prev) =>
                  prev ? { ...prev, description: e.target.value } : prev,
                )
              }
              onBlur={() => {
                setEditingDescription(false);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setEditingDescription(true)}
              className="w-full text-left rounded-md px-2 py-2 text-sm cursor-pointer"
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
                setLocalTask((prev) =>
                  prev ? { ...prev, status: status as Task["status"] } : prev,
                )
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
                setLocalTask((prev) =>
                  prev
                    ? { ...prev, difficulty: difficulty as Task["difficulty"] }
                    : prev,
                )
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
                  setLocalTask((prev) =>
                    prev ? { ...prev, dueDate: undefined } : prev,
                  );
                  return;
                }
                const y = date.getFullYear();
                const m = String(date.getMonth() + 1).padStart(2, "0");
                const d = String(date.getDate()).padStart(2, "0");
                setLocalTask((prev) =>
                  prev ? { ...prev, dueDate: `${y}-${m}-${d}` } : prev,
                );
              }}
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
