import { Icons } from "@/components/ui/icons";

type IconKey = keyof typeof Icons;

export default function IconPicker({
  value,
  onChange,
}: {
  value: IconKey;
  onChange: (k: IconKey) => void;
}) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {(Object.keys(Icons) as IconKey[]).map((k) => (
        <button
          key={k}
          type="button"
          onClick={() => onChange(k)}
          className={`p-2 rounded-md flex items-center justify-center hover:bg-accent ${
            value === k ? "ring-2 ring-primary" : ""
          }`}
          aria-label={k}
        >
          {Icons[k]}
        </button>
      ))}
    </div>
  );
}
