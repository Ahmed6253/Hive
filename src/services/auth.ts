import { axiosInstance } from "@/lib/axios";

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
}) {
  const response = await axiosInstance.post("/auth/register", data);
  return response.data;
}

export async function loginUser(data: { email: string; password: string }) {
  const response = await axiosInstance.post("/auth/login", data);
  return response.data;
}

export async function logoutUser() {
  await axiosInstance.delete("/auth/logout");
}
