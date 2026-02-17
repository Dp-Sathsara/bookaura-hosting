import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { SocialLogin } from "./SocialLogin";
import { useAuth } from "@/context/AuthContext";

// ✅ මෙන්න මේ Import එක වෙනස් කළා (lib/api වෙනුවට services/api)
import api from "@/services/api";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setError(null);

    try {
      // ✅ Axios Call (using services/api)
      const response = await api.post('/auth/login', {
        username: data.email.toLowerCase(),
        password: data.password,
      });

      const { token, user } = response.data;
      login({ ...user, token });

    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-none font-sans">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-black text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">Enter your credentials</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {error && <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md font-bold text-center">{error}</div>}

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} placeholder="m@example.com" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Password</Label>
              <Link to="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
            </div>
            <Input type="password" {...register("password")} />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <Button type="submit" className="w-full font-black text-md h-11" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>

          <SocialLogin />
        </form>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <div className="text-sm font-medium text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary font-bold hover:underline">Register</Link>
        </div>
      </CardFooter>
    </Card>
  );
}