import { useState, useEffect } from "react";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

import { Icons } from "@/components/ui/icons";
import {
  ChevronDown,
  Plus,
  SquarePen,
  FolderX,
  LoaderCircle,
} from "lucide-react";
import ConfirmationDialog from "../../../components/ConfirmationDialog";
import TaskCard from "./TaskCard";
import CreateTaskForm from "./CreateTaskForm";
import TaskDetailsModal from "./TaskDetailsModal";
import { Task, Group } from "@/types/tasks";

export type { Group };

export default function GroupCard({
  group,
  onAddTask,
  onUpdateTask,
  defaultOpen = true,
  forceOpen,
  onDeleteTask,
  onDeleteGroup,
  onEditGroup,
  isAddingTask = false,
  deletingTaskId = null,
  updatingTaskId = null,
  removingTaskId = null,
  newlyCreatedTaskId = null,
  onTaskEntryAnimationEnd,
  onTaskRemoveAnimationEnd,
  isDeletingGroup = false,
}: {
  group: Group;
  onAddTask: (groupId: string, task: Omit<Task, "id">) => void;
  onUpdateTask: (groupId: string, taskId: string, patch: Partial<Task>) => void;
  onDeleteTask?: (groupId: string, taskId: string) => void;
  onDeleteGroup?: (groupId: string) => void;
  onEditGroup?: (group: Group) => void;
  isAddingTask?: boolean;
  deletingTaskId?: string | null;
  updatingTaskId?: string | null;
  removingTaskId?: string | null;
  newlyCreatedTaskId?: string | null;
  onTaskEntryAnimationEnd?: (taskId: string) => void;
  onTaskRemoveAnimationEnd?: (taskId: string) => void;
  isDeletingGroup?: boolean;
  defaultOpen?: boolean;
  forceOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  useEffect(() => {
    if (forceOpen !== undefined) {
      setOpen(forceOpen);
    }
  }, [forceOpen]);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!selectedTask) return;
    const latest = group.tasks.find((t) => t.id === selectedTask.id) ?? null;
    setSelectedTask(latest);
  }, [group.tasks, selectedTask]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    show: boolean;
    taskId?: string;
    taskName?: string;
  }>({ show: false });
  const [checked, setChecked] = useState<Record<string, boolean>>({
    ...group.tasks.reduce(
      (acc, t) => {
        if (t.status === "completed") {
          acc[t.id] = true;
        }
        return acc;
      },
      {} as Record<string, boolean>,
    ),
  });

  const completedCount = group.tasks.filter(
    (t) => t.status === "completed",
  ).length;
  const progressPercent =
    group.tasks.length > 0
      ? Math.round((completedCount / group.tasks.length) * 100)
      : 0;

  const handleUpdateTask = (taskId: string, patch: Partial<Task>) => {
    if (patch.status === "completed") {
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

  const toggleComplete = (taskId: string) => {
    if (checked[taskId]) {
      setChecked((p) => {
        const copy = { ...p };
        delete copy[taskId];
        return copy;
      });
      onUpdateTask(group.id, taskId, { status: "not-started" });
    } else {
      setChecked((p) => ({ ...p, [taskId]: true }));
      onUpdateTask(group.id, taskId, { status: "completed" });
    }
  };

  const handleAddTask = (task: Omit<Task, "id">) => {
    onAddTask(group.id, task);
    setShowAddForm(false);
  };

  const openTaskModal = (task: Task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleUpdateTaskFromModal = (taskId: string, patch: Partial<Task>) => {
    onUpdateTask(group.id, taskId, patch);
    setSelectedTask((prev) =>
      prev && prev.id === taskId ? { ...prev, ...patch } : prev,
    );
  };

  return (
    <div className="bg-card rounded-2xl shadow-md overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="w-full px-3 py-2 flex items-center justify-between gap-2 bg-muted/30 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0 text-base">
              {Icons[group.icon]}
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
          <div className="flex items-center gap-3">
            {group.tasks.length > 0 && (
              <div className="flex items-center gap-1.5 justify-between w-24">
                <div className="w-17 h-1 bg-muted rounded-full overflow-hidden">
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
            {
              <span
                className="text-muted-foreground/60 hover:text-primary"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditGroup?.(group);
                }}
              >
                <SquarePen className="w-4 h-4" />
              </span>
            }
            {onDeleteGroup && (
              <span
                className={`text-muted-foreground/60 hover:text-error ${
                  isDeletingGroup ? "opacity-50 pointer-events-none" : ""
                }`}
                onClick={(e) => {
                  if (isDeletingGroup) return;
                  e.stopPropagation();
                  onDeleteGroup(group.id);
                }}
              >
                {isDeletingGroup ? (
                  <LoaderCircle className="w-4 h-4 animate-spin" />
                ) : (
                  <FolderX className="w-4 h-4" />
                )}
              </span>
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
                {group.tasks.map((t) => (
                  <div
                    key={t.id}
                    className={
                      t.id === newlyCreatedTaskId
                        ? "animate-in fade-in-0 zoom-in-95 duration-300"
                        : t.id === removingTaskId
                          ? "animate-out fade-out-0 slide-out-to-right-2 duration-200 pointer-events-none"
                          : ""
                    }
                    onAnimationEnd={() => {
                      if (t.id === newlyCreatedTaskId) {
                        onTaskEntryAnimationEnd?.(t.id);
                      }
                      if (t.id === removingTaskId) {
                        onTaskRemoveAnimationEnd?.(t.id);
                      }
                    }}
                  >
                    <TaskCard
                      task={t}
                      isDone={t.status === "completed"}
                      isUpdating={updatingTaskId === t.id}
                      isDeleting={
                        deletingTaskId === t.id || removingTaskId === t.id
                      }
                      onOpen={() => openTaskModal(t)}
                      onToggleComplete={() => toggleComplete(t.id)}
                      onUpdateStatus={(status) =>
                        handleUpdateTask(t.id, { status })
                      }
                      onUpdateDifficulty={(difficulty) =>
                        handleUpdateTask(t.id, { difficulty })
                      }
                      onDelete={() =>
                        setDeleteConfirm({
                          show: true,
                          taskId: t.id,
                          taskName: t.name,
                        })
                      }
                    />
                  </div>
                ))}
              </div>
            )}
            {showAddForm ? (
              <CreateTaskForm
                onAddTask={handleAddTask}
                onCancel={() => setShowAddForm(false)}
                isSubmitting={isAddingTask}
              />
            ) : (
              <button
                type="button"
                onClick={() => {
                  setOpen(true);
                  setShowAddForm(true);
                }}
                disabled={isAddingTask}
                className="w-full px-3 py-2 flex items-center justify-center gap-1.5 text-xs font-medium text-muted-foreground rounded-b-lg border-t border-dashed border-border/30 hover:text-foreground bg-muted/20 hover:bg-muted/30 transition-all duration-200 disabled:opacity-60 disabled:pointer-events-none"
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
        isConfirming={
          Boolean(deletingTaskId) &&
          deleteConfirm.taskId === deletingTaskId &&
          removingTaskId !== deletingTaskId
        }
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
      <TaskDetailsModal
        show={showTaskModal}
        toggleShow={() => setShowTaskModal(false)}
        task={selectedTask}
        onUpdateTask={handleUpdateTaskFromModal}
      />
    </div>
  );
}
