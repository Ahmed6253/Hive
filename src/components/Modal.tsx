import { X } from "lucide-react";
import { useState } from "react";

export default function Modal({
  children,
  title,
  show,
  toggleShow,
  className = "w-[700px]",
}: {
  children: React.ReactNode | React.ReactNode[];
  title: string;
  show: boolean;
  className?: string;
  toggleShow: () => void;
}) {
  const [isClose, setIsClose] = useState(false);
  const toggle = () => {
    if (show) {
      setIsClose(true);

      const timer = setTimeout(() => {
        toggleShow();
        setIsClose(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  };
  if (!show) {
    return null;
  }
  return (
    <div
      onClick={toggle}
      className="fixed top-0 left-0 w-full h-full bg-bg/90 flex justify-center items-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`bg-card mx-2 overflow-hidden from-bottom max-h-[90vh] min-w-[320px]  p-4 rounded-lg space-y-2 overflow-y-auto ${className} ${
          isClose && "back-bottom"
        }`}
      >
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button onClick={toggle} className="cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
}
