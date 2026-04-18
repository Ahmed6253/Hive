import * as React from "react";
import { cn } from "../../lib/utils";
import { Eye, EyeOff } from "lucide-react";

function Input({
  className,
  type,
  error,
  ...props
}: React.ComponentProps<"input"> & { error?: string }) {
  const [showPassword, setShowPassword] = React.useState(false);
  return (
    <>
      <div className="relative">
        <input
          type={showPassword ? "text" : type}
          data-slot="input"
          className={cn(
            "file:text-foreground mt-1 placeholder:text-accent selection:bg-text selection:text-muted dark:bg-input/30 border-accent h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-input focus-visible:ring-[0.7px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className,
          )}
          {...props}
        />
        {type === "password" && (
          <div
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="w-4" />
            ) : (
              <Eye className="w-4" />
            )}
          </div>
        )}
      </div>
      {error && <p className="text-error text-xs mt-1">{error}</p>}
    </>
  );
}

export { Input };
