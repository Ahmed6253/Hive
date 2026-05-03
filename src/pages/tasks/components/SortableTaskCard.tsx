import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import TaskCard from "./TaskCard";
import { Task } from "@/types/tasks";

type SortableTaskCardProps = {
  task: Task;
  isDone: boolean;
  isUpdating: boolean;
  isDeleting: boolean;
  onOpen: () => void;
  onToggleComplete: () => void;
  onUpdateStatus: (status: string) => void;
  onUpdateDifficulty: (difficulty: Task["difficulty"]) => void;
  onDelete: () => void;
  newlyCreatedTaskId?: string | null;
  removingTaskId?: string | null;
  onTaskEntryAnimationEnd?: (taskId: string) => void;
  onTaskRemoveAnimationEnd?: (taskId: string) => void;
};

export default function SortableTaskCard({
  task,
  isDone,
  isUpdating,
  isDeleting,
  onOpen,
  onToggleComplete,
  onUpdateStatus,
  onUpdateDifficulty,
  onDelete,
  newlyCreatedTaskId,
  removingTaskId,
  onTaskEntryAnimationEnd,
  onTaskRemoveAnimationEnd,
}: SortableTaskCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : "auto" as const,
  };

  const isNew = task.id === newlyCreatedTaskId;
  const isRemoving = task.id === removingTaskId;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={
        isNew
          ? "animate-in fade-in-0 zoom-in-95 duration-500"
          : isRemoving
            ? "animate-out fade-out-0 zoom-out-95 duration-500 pointer-events-none [animation-fill-mode:forwards]"
            : ""
      }
      onAnimationEnd={() => {
        if (isNew) onTaskEntryAnimationEnd?.(task.id);
        if (isRemoving) onTaskRemoveAnimationEnd?.(task.id);
      }}
    >
      <motion.div layout transition={{ type: "spring", stiffness: 350, damping: 25 }}>
        <TaskCard
          task={task}
          isDone={isDone}
          isUpdating={isUpdating}
          isDeleting={isDeleting}
          onOpen={onOpen}
          onToggleComplete={onToggleComplete}
          onUpdateStatus={onUpdateStatus}
          onUpdateDifficulty={onUpdateDifficulty}
          onDelete={onDelete}
        />
      </motion.div>
    </div>
  );
}