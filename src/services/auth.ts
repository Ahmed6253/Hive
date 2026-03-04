import { axiosInstance } from "@/lib/axios";
import toast from "react-hot-toast";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  } catch (error: any) {
    console.log("Error during registration:", error);
    toast.error(error.response?.data?.message || "Registration failed");
    return;
  }
}

export async function loginUser(data: { email: string; password: string }) {
  try {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  } catch (error: any) {
    console.log("Error during login:", error);
    toast.error(error.response?.data?.message || "Login failed");
    return;
  }
}

export async function logoutUser() {
  try {
    await axiosInstance.delete("/auth/logout");
  } catch (error: any) {
    console.log("Error during logout:", error);
    toast.error(error.response?.data?.message || "Logout failed");
    return;
  }
}
