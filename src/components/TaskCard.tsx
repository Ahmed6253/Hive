import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";

type Task = {
  id: string;
  name: string;
  description?: string;
  dueDate?: string;
  status: string;
  difficulty: "Easy" | "Medium" | "Hard";
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

export default function TaskCard({
  task,
  isDone,
  onToggleComplete,
  onUpdateStatus,
  onUpdateDifficulty,
  onDelete,
}: {
  task: Task;
  isDone: boolean;
  onToggleComplete: () => void;
  onUpdateStatus: (status: string) => void;
  onUpdateDifficulty: (difficulty: Task["difficulty"]) => void;
  onDelete: () => void;
}) {
  return (
    <div
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
          onCheckedChange={onToggleComplete}
          className={`mt-0.5 w-4 h-4 rounded-md border-1 shrink-0 flex items-center justify-center transition-all duration-200 ${
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
            {task.name}
          </span>
          {task.description && (
            <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
              {task.description}
            </p>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon-xs"
          className="text-muted-foreground/60 hover:text-error shrink-0 -mt-0.5 -mr-1"
          onClick={onDelete}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-1 mt-auto">
        <Select value={task.status} onValueChange={onUpdateStatus}>
          <SelectTrigger
            className={`data-[size=default]:h-5 bg-transparent rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-2 border ${getStatusPillClass(
              task.status,
            )}`}
            iconColor={getStatusPillClass(task.status)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Not Started">Not Started</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select value={task.difficulty} onValueChange={onUpdateDifficulty}>
          <SelectTrigger
            className={`data-[size=default]:h-5 rounded-md px-1.5 py-0.5 text-[10px] font-medium shadow-none focus-visible:ring-0 gap-1 [&_svg]:size-2 ${getDifficultyPillClass(
              task.difficulty,
            )}`}
            iconColor={getDifficultyPillClass(task.difficulty)}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Easy">Easy</SelectItem>
            <SelectItem value="Medium">Medium</SelectItem>
            <SelectItem value="Hard">Hard</SelectItem>
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
