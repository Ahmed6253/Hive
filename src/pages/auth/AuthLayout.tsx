import { Outlet } from "react-router-dom";
import Logo from "@/assets/hiveLogo.svg";
import { Hexagon } from "lucide-react";

const HexDecor = ({
  size,
  className,
}: {
  size: number;
  className?: string;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 100 115"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M50 2L96 27.5V82.5L50 108L4 82.5V27.5L50 2Z"
      stroke="currentColor"
      strokeWidth="3"
      fill="none"
    />
  </svg>
);

const features = [
  { label: "Task & project tracking" },
  { label: "Collaborative workspaces" },
  { label: "Reward-based productivity" },
  { label: "Smart notes & reminders" },
];

export default function AuthLayout() {
  return (
    <div className="min-h-screen lg:mx-8 mx-20 grid grid-cols-1 lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="hidden opacity-80  lg:flex rounded-lg my-12 mx-5 flex-col justify-between relative overflow-hidden bg-card/30 px-10 pt-10 pb-5 ">
        {/* Decorative hexagons */}
        <HexDecor
          size={340}
          className="absolute -top-20 -left-20 text-primary opacity-5 rotate-12"
        />
        <HexDecor
          size={220}
          className="absolute bottom-10 -right-12 text-primary opacity-10 -rotate-6"
        />
        <HexDecor
          size={110}
          className="absolute top-1/2 right-16 text-accent opacity-15"
        />

        {/* Logo + name */}
        <div className="relative z-10 flex flex-col gap-4">
          <img src={Logo} alt="Hive Logo" className="w-12 -rotate-90" />
          <div>
            <p className="tracking-[0.35em] font-bold text-3xl text-text">
              HIVE
            </p>
            <p className="text-secondary text-xs tracking-wide">
              Time Management & Productivity
            </p>
          </div>
        </div>

        {/* Tagline */}
        <div className="relative z-10 flex-1 flex flex-col justify-center ">
          <h2 className="text-3xl font-semibold text-text leading-snug max-w-xs">
            Manage your time,{" "}
            <span className="text-primary">grow your hive.</span>
          </h2>
          <p className="text-text mt-4 text-sm font-light leading-relaxed max-w-sm">
            Everything you need to stay focused, collaborate with your team, and
            turn productivity into rewards — all in one place.
          </p>

          <ul className="mt-8 space-y-3 ">
            {features.map((f) => (
              <li
                key={f.label}
                className="flex text-primary items-center gap-3 text-sm"
              >
                <Hexagon className="w-4 h-4" />
                <span className="text-text">{f.label}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer note */}
        <p className="relative z-10 text-xs text-secondary/50 mt-8">
          © {new Date().getFullYear()} Hive. All rights reserved.
        </p>
      </div>

      {/* Right auth form panel */}
      <div className="w-full p-8 lg:p-20 rounded-lg lg:bg-transparent bg-card/20 my-auto">
        <Outlet />
        <div className="relative lg:hidden flex z-10 items-center justify-center mt-12 gap-2">
          <img src={Logo} alt="Hive Logo" className="w-7 -rotate-90" />
          <div>
            <p className="tracking-[0.35em] font-bold text-text">HIVE</p>
          </div>
        </div>
      </div>
    </div>
  );
}
