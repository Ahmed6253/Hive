import { useState } from "react";
import Modal from "./Modal";
import { Button } from "@/components/ui/button";

export default function ConfirmationDialog({
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  show,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const handleConfirm = () => {
    onConfirm();
    onCancel();
  };

  return (
    <Modal
      className="w-[500px]"
      title={title}
      show={show}
      toggleShow={onCancel}
    >
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button variant="destructive" onClick={handleConfirm}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
