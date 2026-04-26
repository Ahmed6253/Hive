import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import IconCarousel from "@/components/IconCarousel";
import { Icons } from "@/components/ui/icons";
import Label from "@/components/ui/label";
import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";

type CreatePayload = {
  name: string;
  description?: string;
  iconKey: string;
};

type GroupFormData = {
  id?: string;
  name: string;
  description?: string;
  iconKey: string;
};

export default function CreateGroupModal({
  show,
  toggleShow,
  mode = "create",
  initialData,
  isSubmitting = false,
  onSubmit,
}: {
  show: boolean;
  toggleShow: () => void;
  mode?: "create" | "edit";
  initialData?: GroupFormData;
  isSubmitting?: boolean;
  onSubmit: (payload: CreatePayload) => void;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    iconKey: Object.keys(Icons)[0] ?? "work",
  });

  useEffect(() => {
    if (!show) return;
    if (mode === "edit" && initialData) {
      setForm({
        name: initialData.name ?? "",
        description: initialData.description ?? "",
        iconKey: initialData.iconKey ?? Object.keys(Icons)[0] ?? "work",
      });
      return;
    }
    setForm({
      name: "",
      description: "",
      iconKey: Object.keys(Icons)[0] ?? "work",
    });
  }, [show, mode, initialData]);

  const handleSubmit = () => {
    if (!form.name || isSubmitting) return;
    onSubmit({
      name: form.name,
      description: form.description,
      iconKey: form.iconKey,
    });
  };

  return (
    <Modal
      className="w-[500px]"
      show={show}
      toggleShow={toggleShow}
      title={mode === "edit" ? "Edit group" : "Create group"}
    >
      <div className="space-y-3">
        <Label htmlFor="group-name" className="text-sm">
          Group Name
        </Label>
        <Input
          placeholder="Group name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <Label htmlFor="group-description" className="text-sm">
          Description
        </Label>

        <Textarea
          className="resize-none"
          placeholder="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <div>
          <IconCarousel
            value={form.iconKey}
            onChange={(k) => setForm({ ...form, iconKey: k })}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="secondary"
            disabled={isSubmitting}
            onClick={() => {
              toggleShow();
            }}
          >
            Cancel
          </Button>
          <Button disabled={!form.name || isSubmitting} onClick={handleSubmit}>
            {isSubmitting && <LoaderCircle className=" h-4 w-4 animate-spin" />}
            {mode === "edit" ? "Save" : "Create"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
