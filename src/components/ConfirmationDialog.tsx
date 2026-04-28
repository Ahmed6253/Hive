import Modal from "./Modal";
import { Button } from "@/components/ui/button";
import { LoaderCircle } from "lucide-react";

export default function ConfirmationDialog({
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  show,
  isConfirming = false,
  onConfirm,
  onCancel,
}: {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  show: boolean;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <Modal
      className="w-[500px]"
      title={title}
      show={show}
      toggleShow={onCancel}
    >
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel} disabled={isConfirming}>
          {cancelText}
        </Button>
        <Button
          variant="destructive"
          onClick={onConfirm}
          disabled={isConfirming}
        >
          {isConfirming && <LoaderCircle className=" h-4 w-4 animate-spin" />}
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
