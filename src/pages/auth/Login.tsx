import { Link } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Label from "../../components/ui/label";
import { loginUser } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { loginSchema, LoginInput } from "./validation";
import { useState } from "react";
import { useAuthStore, AuthState } from "@/stores/useAuthStore";
import { LoaderCircle } from "lucide-react";

export default function Login() {
  const saveUser = useAuthStore((state: AuthState) => state.saveUser);

  const [formData, setFormData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      if (!data) return;
      toast.success("Logged in successfully!");
      saveUser(data);
    },
    onError: () => {
      toast.error("Invalid email or password.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({ email: "", password: "" });
    const result = loginSchema.safeParse(formData);
    if (!result.success) {
      const validationErrors: LoginInput = { email: "", password: "" };
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof LoginInput;
        if (!validationErrors[field]) {
          validationErrors[field] = err.message;
        }
      });
      setErrors(validationErrors);
      return;
    }
    mutate(result.data);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Welcome back</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Sign in to your account
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            error={errors.email}
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            error={errors.password}
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <Button type="submit" className="w-full mt-4">
          {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don't have an account?{" "}
        <Link
          to="/auth/register"
          className="text-primary underline-offset-4 hover:underline"
        >
          Register
        </Link>
      </p>
    </div>
  );
}
