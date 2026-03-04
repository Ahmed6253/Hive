import { Link } from "react-router-dom";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import Label from "../../../components/ui/label";
import { registerUser } from "@/services/auth";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { registerSchema, RegisterInput } from "../validation";
import { useState } from "react";
import { useAuthStore, AuthState } from "@/stores/useAuthStore";
import { LoaderCircle } from "lucide-react";

export default function Register() {
  const saveUser = useAuthStore((state: AuthState) => state.saveUser);
  const normalizedInput: RegisterInput = {
    name: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  };

  const [formData, setFormData] = useState<RegisterInput>({
    ...normalizedInput,
  });

  const [errors, setErrors] = useState<RegisterInput>({ ...normalizedInput });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const { mutate, isPending } = useMutation({
    mutationFn: registerUser,
    onSuccess: (data) => {
      if (!data) return;
      toast.success("Registration successful!");
      saveUser(data);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({
      ...normalizedInput,
    });
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const validationErrors: RegisterInput = {
        ...normalizedInput,
      };
      result.error.issues.forEach((err) => {
        const field = err.path[0] as keyof RegisterInput;
        if (!validationErrors[field]) {
          validationErrors[field] = err.message;
        }
      });
      setErrors(validationErrors);

      return;
    }

    mutate(formData);
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold">Create an account</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Start managing your time with Hive
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div className="space-y-1">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            placeholder="John Doe"
            error={errors.name}
            value={formData.name}
            onChange={handleChange}
          />
        </div>

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
        <div className="space-y-1">
          <Label htmlFor="passwordConfirmation">Confirm Password</Label>
          <Input
            id="passwordConfirmation"
            type="password"
            placeholder="••••••••"
            // error={errors.passwordConfirmation}
            value={formData.passwordConfirmation}
            onChange={handleChange}
          />
        </div>

        <Button className="w-full mt-4">
          {isPending && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/auth/login"
          className="text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
