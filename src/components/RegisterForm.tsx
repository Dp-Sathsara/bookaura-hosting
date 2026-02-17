import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, Check, X } from "lucide-react";
import { PasswordInput } from "@/components/ui/password-input";
import api from "@/services/api";

// ✅ 1. SocialLogin එක Import කරන්න
import { SocialLogin } from "./SocialLogin";

const registerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Min 8 chars"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { login } = useAuth();
  const navigate = useNavigate(); // Navigation සඳහා
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const password = watch("password", "");

  const validations = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter", valid: /[a-z]/.test(password) },
    { label: "At least one number", valid: /[0-9]/.test(password) },
    { label: "At least one special character (!@#$)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  // ✅ 2. සාමාන්‍ය Email/Password Register Function එක
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', {
        username: `${data.firstName} ${data.lastName}`,
        email: data.email.toLowerCase(),
        password: data.password,
        role: 'CUSTOMER'
      });

      const { token, user } = response.data;
      login({ ...user, token });
      navigate('/dashboard'); // හෝ අදාළ පිටුවට

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ 3. Social Login Success වූ විට ක්‍රියාත්මක වන Function එක
  const handleSocialAuthSuccess = async (firebaseUser: any) => {
    setIsLoading(true);
    setError(null);

    try {
      // Backend එකට යවන දත්ත සකස් කරගන්න
      // Firebase user object එකේ displayName සහ email තිබේ
      const payload = {
        email: firebaseUser.email,
        username: firebaseUser.displayName || "New User",
        photoUrl: firebaseUser.photoURL,
        providerId: firebaseUser.providerData[0]?.providerId || 'social', // google.com, etc.
        uid: firebaseUser.uid // Firebase UID එක ආරක්ෂාවට backend එකට යැවිය හැක
      };

      // Backend එකට request එක යවන්න (ඔබේ backend එකේ මේ route එක සාදා තිබිය යුතුයි)
      const response = await api.post('/auth/social-login', payload);

      const { token, user } = response.data;

      // Context එක update කර login කරවන්න
      login({ ...user, token });
      navigate('/dashboard');

    } catch (err: any) {
      console.error("Social Auth Backend Error:", err);
      setError(err.response?.data?.message || 'Social login failed via backend');
    } finally {
      setIsLoading(false);
    }
  };

  const { onBlur: onPasswordBlur, ...passwordRegisterProps } = register("password");

  return (
    <Card className="w-full max-w-md shadow-2xl border-none font-sans">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-black text-center tracking-tight">Create an account</CardTitle>
        <CardDescription className="text-center font-medium">Enter your email below to create your account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && <div className="p-3 mb-4 text-sm text-red-500 bg-red-50 rounded text-center font-bold">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* ... Inputs ටික (First Name, Last Name, etc.) කලින් විදියටම ... */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>First name</Label>
              <Input {...register("firstName")} placeholder="John" />
              {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
            </div>
            <div className="space-y-2">
              <Label>Last name</Label>
              <Input {...register("lastName")} placeholder="Doe" />
              {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("email")} placeholder="m@example.com" />
            {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <PasswordInput
              {...passwordRegisterProps}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={(e) => { setIsPasswordFocused(false); onPasswordBlur(e); }}
            />
            {isPasswordFocused && (
              <div className="space-y-1.5 pt-1 p-3 bg-muted/50 rounded-lg animate-in fade-in zoom-in-95 duration-200">
                <p className="text-xs font-bold text-muted-foreground mb-2">Password must contain:</p>
                {validations.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    {rule.valid ? <Check className="h-3 w-3 text-green-600 font-bold" /> : <X className="h-3 w-3 text-red-500" />}
                    <span className={rule.valid ? "text-green-600 font-medium" : "text-muted-foreground"}>{rule.label}</span>
                  </div>
                ))}
              </div>
            )}
            {errors.password && !isPasswordFocused && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <PasswordInput {...register("confirmPassword")} />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword.message}</p>}
          </div>

          <Button type="submit" className="w-full font-black text-md h-11" disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create Account"}
          </Button>

          {/* ✅ 4. Social Login Component එක මෙතනට Pass කරන්න */}
          <SocialLogin
            onSocialAuthSuccess={handleSocialAuthSuccess}
            isLoading={isLoading}
          />

        </form>
      </CardContent>
      <CardFooter className="flex justify-center pb-6">
        <div className="text-sm font-medium text-muted-foreground">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Login</Link>
        </div>
      </CardFooter>
    </Card>
  );
}