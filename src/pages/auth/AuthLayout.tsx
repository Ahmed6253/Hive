import { Outlet } from "react-router-dom";
import LOGO from "@/assets/hiveLogo.svg";

export default function AuthLayout() {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div></div>
      <div className=" w-full p-20 my-auto ">
        <img
          src={LOGO}
          alt="Hive Logo"
          className="mx-auto mb-10 w-20 -rotate-90"
        />
        <Outlet />
      </div>
    </div>
  );
}
