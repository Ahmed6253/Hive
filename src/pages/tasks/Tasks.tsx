import { useState } from "react";
import PageHeader from "@/components/PageHeader";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import GroupCard from "@/pages/tasks/components/GroupCard";
import CreateGroupModal from "@/pages/tasks/components/CreateGroupModal";
import ConfirmationDialog from "@/components/ConfirmationDialog";
import { Plus, ChevronsDownUp, ChevronsUpDown } from "lucide-react";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useTasks } from "./useTasks";
import TaskCard from "./components/TaskCard";
import { Task } from "@/types/tasks";

export default function Tasks() {
  const {
    groups,
    isFetching,
    allCollapsed,
    setAllCollapsed,
    showGroupModal,
    editingGroup,
    newlyCreatedGroupId,
    removingGroupId,
    deletingGroupId,
    creatingTaskGroupId,
    newlyCreatedTask,
    deletingTask,
    updatingTask,
    removingTask,
    deleteConfirm,
    addTask,
    updateTaskMutation,
    deleteTaskMutation,
    handleDeleteGroup,
    handleEditGroup,
    openNewGroupModal,
    closeGroupModal,
    submitGroupModal,
    confirmDeleteGroup,
    cancelDeleteGroup,
    handleGroupAnimationEnd,
    handleTaskEntryAnimationEnd,
    handleTaskRemoveAnimationEnd,
    createGroupMutation,
    editGroupMutation,
    deleteGroupMutation,
    moveTask,
    persistSortOrder,
  } = useTasks();

  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const findTaskGroup = (taskId: string) =>
    groups.find((g) => g.tasks.some((t) => t.id === taskId));

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={(event) => {
        const group = findTaskGroup(String(event.active.id));
        if (!group) return;
        const task = group.tasks.find((t) => t.id === event.active.id);
        if (task) setActiveTask(task);
      }}
      onDragEnd={(event) => {
        const { active, over } = event;
        setActiveTask(null);

        if (!over) return;

        const activeId = String(active.id);
        const overId = String(over.id);

        const currentGroup = findTaskGroup(activeId);
        if (!currentGroup) return;

        const overGroup = findTaskGroup(overId);
        if (overGroup?.id !== currentGroup.id) return;

        const latestGroups = moveTask(
          activeId,
          currentGroup.id,
          overGroup.id,
          overId,
        );
        persistSortOrder(latestGroups, [currentGroup.id]);
      }}
      onDragCancel={() => setActiveTask(null)}
    >
      <PageHeader
        title="Tasks"
        description="Groups organize related tasks. Create groups and add tasks."
      >
        <div className="flex items-center justify-end gap-2 mb-4">
          {groups.length > 0 && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => setAllCollapsed(!allCollapsed)}
              title={allCollapsed ? "Expand all" : "Collapse all"}
            >
              {allCollapsed ? (
                <ChevronsUpDown className=" transition-transform duration-200" />
              ) : (
                <ChevronsDownUp className=" transition-transform duration-200" />
              )}
            </Button>
          )}
          <Button size="icon" onClick={openNewGroupModal} title="New group">
            <Plus className="" />
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-4">
        {isFetching && (
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-2xl shadow-md overflow-hidden opacity-50 "
              >
                <div className="px-3 py-2 flex items-center justify-between gap-2 bg-muted/30">
                  <Skeleton className="h-6 w-24" />
                </div>
                <div className="p-3 space-y-2">
                  {[1, 2].map((j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-sm" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </>
        )}
        {groups?.length === 0 && !isFetching ? (
          <div className="text-muted-foreground">
            No groups yet. Create one to get started.
          </div>
        ) : (
          groups.map((g) => (
            <div
              key={g.id}
              className={
                g.id === newlyCreatedGroupId
                  ? "animate-in fade-in-0 zoom-in-95 duration-500"
                  : g.id === removingGroupId
                    ? "animate-out fade-out-0 zoom-out-95 duration-500 pointer-events-none [animation-fill-mode:forwards]"
                    : ""
              }
              onAnimationEnd={() => handleGroupAnimationEnd(g.id)}
            >
              <GroupCard
                group={g}
                onAddTask={addTask}
                onUpdateTask={(groupId, taskId, patch) => {
                  updateTaskMutation.mutate({ groupId, taskId, patch });
                }}
                defaultOpen={!allCollapsed}
                forceOpen={!allCollapsed}
                onDeleteTask={(groupId, taskId) =>
                  deleteTaskMutation.mutate({ groupId, taskId })
                }
                isAddingTask={creatingTaskGroupId === g.id}
                deletingTaskId={
                  deletingTask?.groupId === g.id ? deletingTask.taskId : null
                }
                updatingTaskId={
                  updatingTask?.groupId === g.id ? updatingTask.taskId : null
                }
                removingTaskId={
                  removingTask?.groupId === g.id ? removingTask.taskId : null
                }
                newlyCreatedTaskId={
                  newlyCreatedTask?.groupId === g.id
                    ? newlyCreatedTask.taskId
                    : null
                }
                onTaskEntryAnimationEnd={(taskId) =>
                  handleTaskEntryAnimationEnd(g.id, taskId)
                }
                onTaskRemoveAnimationEnd={(taskId) =>
                  handleTaskRemoveAnimationEnd(g.id, taskId)
                }
                onDeleteGroup={handleDeleteGroup}
                onEditGroup={handleEditGroup}
                isDeletingGroup={deletingGroupId === g.id}
              />
            </div>
          ))
        )}
      </div>

      <DragOverlay dropAnimation={null}>
        {activeTask ? (
          <div className="opacity-80 shake shadow-xl rounded-lg">
            <TaskCard
              task={activeTask}
              isDone={activeTask.status === "completed"}
              isUpdating={false}
              isDeleting={false}
              onOpen={() => {}}
              onToggleComplete={() => {}}
              onUpdateStatus={() => {}}
              onUpdateDifficulty={() => {}}
              onDelete={() => {}}
            />
          </div>
        ) : null}
      </DragOverlay>

      <CreateGroupModal
        show={showGroupModal}
        toggleShow={closeGroupModal}
        mode={editingGroup ? "edit" : "create"}
        isSubmitting={
          createGroupMutation.isPending || editGroupMutation.isPending
        }
        initialData={
          editingGroup
            ? {
                id: editingGroup.id,
                name: editingGroup.name,
                description: editingGroup.description,
                iconKey: editingGroup.icon,
              }
            : undefined
        }
        onSubmit={submitGroupModal}
      />
      <ConfirmationDialog
        show={deleteConfirm.show}
        isConfirming={deleteGroupMutation.isPending}
        title="Delete Group"
        description={`Are you sure you want to delete "${deleteConfirm.groupName}"? All tasks in this group will also be deleted. This action cannot be undone.`}
        onConfirm={confirmDeleteGroup}
        onCancel={cancelDeleteGroup}
      />
    </DndContext>
  );
}
