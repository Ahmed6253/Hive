import Modal from "@/components/Modal";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import IconCarousel from "@/components/IconCarousel";
import { Icons } from "@/components/ui/icons";
import Label from "@/components/ui/label";
import { useState } from "react";

type CreatePayload = {
  name: string;
  description?: string;
  iconKey: string;
};

export default function CreateGroupModal({
  show,
  toggleShow,
  onCreate,
}: {
  show: boolean;
  toggleShow: () => void;
  onCreate: (payload: CreatePayload) => void;
}) {
  const [form, setForm] = useState<{
    name: string;
    description: string;
    iconKey: string;
  }>({
    name: "",
    description: "",
    iconKey: Object.keys(Icons)[0] ?? "work",
  });

  const reset = () =>
    setForm({
      name: "",
      description: "",
      iconKey: Object.keys(Icons)[0] ?? "work",
    });

  const handleCreate = () => {
    if (!form.name) return;
    onCreate({
      name: form.name,
      description: form.description,
      iconKey: form.iconKey,
    });
    reset();
    toggleShow();
  };

  return (
    <Modal
      className="w-[500px]"
      show={show}
      toggleShow={toggleShow}
      title="Create group"
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
            variant="outline"
            onClick={() => {
              reset();
              toggleShow();
            }}
          >
            Cancel
          </Button>
          <Button onClick={handleCreate}>Create</Button>
        </div>
      </div>
    </Modal>
  );
}
