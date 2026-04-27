import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar, LoaderCircle } from "lucide-react";
import { Task } from "@/types/tasks";

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
  if (status === "completed") return "border-success/60 text-success";
  if (status === "in-progress") return "border-alert/60 text-alert";
  return "border-secondary/40 text-secondary";
}

function getDifficultyPillClass(difficulty: Task["difficulty"]) {
  if (difficulty === 1) {
    return "border-transparent bg-success text-white focus-visible:border-success";
  }
  if (difficulty === 2) {
    return "border-transparent bg-alert text-white focus-visible:border-alert";
  }
  return "border-transparent bg-error text-white focus-visible:border-error";
}

export default function TaskCard({
  task,
  isDone,
  onToggleComplete,
  onUpdateStatus,
  onUpdateDifficulty,
  onDelete,
  onOpen,
  isUpdating = false,
  isDeleting = false,
}: {
  task: Task;
  isDone: boolean;
  onToggleComplete: () => void;
  onUpdateStatus: (status: string) => void;
  onUpdateDifficulty: (difficulty: Task["difficulty"]) => void;
  onDelete: () => void;
  onOpen: () => void;
  isUpdating?: boolean;
  isDeleting?: boolean;
}) {
  const isBusy = isUpdating || isDeleting;
  return (
    <div
      onClick={onOpen}
      className={`rounded-lg relative bg-background/50 shadow-sm p-3 border border-transparent min-h-[95px] flex flex-col gap-1.5 transition-all duration-200 hover:shadow-sm ${
        isDone ? "opacity-70" : "border-border/50 hover:border-border/40"
      } cursor-pointer`}
    >
      <div className="flex items-center gap-1.5">
        <Checkbox
          aria-label="Mark complete"
          checked={isDone}
          onCheckedChange={() => onToggleComplete()}
          onClick={(e) => e.stopPropagation()}
          disabled={isBusy}
          className={`mt-0.5 w-4 h-4 rounded-md border-1 shrink-0 flex items-center justify-center transition-all duration-200 ${
            isDone
              ? "bg-success border-success"
              : "border-border hover:border-primary"
          }`}
        />

        <span
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className={`font-normal w-fit  text-xs leading-snug transition-all block ${
            isDone ? "line-through text-muted-foreground" : ""
          }`}
        >
          {task.name}
        </span>

        {isDeleting || isUpdating ? (
          <LoaderCircle className="absolute w-5 h-5 right-3 top-3 animate-spin shrink-0 " />
        ) : (
          <Button
            variant="ghost"
            className="text-muted-foreground/60 hover:text-error shrink-0 absolute right-0 top-1"
            disabled={isDeleting}
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
          >
            <Trash2 />
          </Button>
        )}
      </div>
      {task.description && (
        <p
          className={`font-normal text-[10px] text-muted-foreground leading-snug line-clamp-1 break-words${
            isDone ? "line-through text-muted-foreground/50" : ""
          }`}
        >
          {task.description}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-1 mt-auto">
        <Select value={task.status} onValueChange={onUpdateStatus}>
          <SelectTrigger
            disabled={isBusy}
            className={`data-[size=default]:h-5 bg-transparent rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-2 border ${getStatusPillClass(
              task.status,
            )}`}
            iconColor={getStatusPillClass(task.status)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not-started">Not Started</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={task.difficulty} onValueChange={onUpdateDifficulty}>
          <SelectTrigger
            disabled={isBusy}
            className={`data-[size=default]:h-5 rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-2 ${getDifficultyPillClass(
              task.difficulty,
            )}`}
            iconColor={getDifficultyPillClass(task.difficulty)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={1}>Easy</SelectItem>
            <SelectItem value={2}>Medium</SelectItem>
            <SelectItem value={3}>Hard</SelectItem>
          </SelectContent>
        </Select>
        {task.dueDate && (
          <span className="text-[10px] text-muted-foreground flex items-center gap-1 ml-auto">
            <Calendar className="w-2.5 h-2.5" />
            {formatDate(task.dueDate)}
          </span>
        )}
      </div>
    </div>
  );
}
