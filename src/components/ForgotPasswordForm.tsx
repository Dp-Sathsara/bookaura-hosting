import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft, CheckCircle2, Check, X } from "lucide-react";
// ✅ 1. Password Input එක Import කරන්න
import { PasswordInput } from "@/components/ui/password-input"; 

// Validation Schemas
const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

const resetSchema = z.object({
  otp: z.string().min(4, "Invalid OTP code"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export function ForgotPasswordForm() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");

  const emailForm = useForm<z.infer<typeof emailSchema>>({ resolver: zodResolver(emailSchema) });
  const resetForm = useForm<z.infer<typeof resetSchema>>({ 
    resolver: zodResolver(resetSchema),
    mode: "onChange" 
  });

  // ✅ 2. Password එක Live Watch කරන්න
  const password = resetForm.watch("password", "");

  // ✅ 3. Validation Checklist Logic
  const validations = [
    { label: "At least 8 characters", valid: password.length >= 8 },
    { label: "At least one uppercase letter", valid: /[A-Z]/.test(password) },
    { label: "At least one lowercase letter", valid: /[a-z]/.test(password) },
    { label: "At least one number", valid: /[0-9]/.test(password) },
    { label: "At least one special character (!@#$)", valid: /[^A-Za-z0-9]/.test(password) },
  ];

  const onSendOtp = async (data: z.infer<typeof emailSchema>) => {
    setIsLoading(true);
    console.log("Sending OTP to:", data.email);
    setUserEmail(data.email);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const onResetPassword = async (data: z.infer<typeof resetSchema>) => {
    setIsLoading(true);
    console.log("Resetting Password:", { email: userEmail, ...data });
    setTimeout(() => {
      setIsLoading(false);
      navigate("/login");
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md shadow-2xl border-none font-sans">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-black text-center tracking-tight">
          {step === 1 ? "Forgot Password?" : "Reset Password"}
        </CardTitle>
        <CardDescription className="text-center font-medium">
          {step === 1 
            ? "Enter your email address and we'll send you a code to reset your password." 
            : `We sent a code to ${userEmail}. Enter it below to reset your password.`}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* 👉 STEP 1: Email Input */}
        {step === 1 && (
          <form onSubmit={emailForm.handleSubmit(onSendOtp)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="font-bold">Email</Label>
              <Input id="email" type="email" placeholder="m@example.com" {...emailForm.register("email")} />
              {emailForm.formState.errors.email && (
                <p className="text-red-500 text-xs font-bold">{emailForm.formState.errors.email.message}</p>
              )}
            </div>
            
            <Button type="submit" className="w-full font-black text-md h-11" disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Code"}
            </Button>
          </form>
        )}

        {/* 👉 STEP 2: OTP & New Password [UPDATED] */}
        {step === 2 && (
          <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="otp" className="font-bold">OTP Code</Label>
              <Input id="otp" placeholder="123456" className="tracking-widest text-center font-black text-lg" {...resetForm.register("otp")} />
              {resetForm.formState.errors.otp && (
                <p className="text-red-500 text-xs font-bold">{resetForm.formState.errors.otp.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="font-bold">New Password</Label>
              
              {/* ✅ Eye Icon එක සහිත Password Input */}
              <PasswordInput id="password" {...resetForm.register("password")} />
              
              {/* ✅ Live Validation Checklist */}
              <div className="space-y-1.5 pt-1 p-3 bg-muted/50 rounded-lg">
                <p className="text-xs font-bold text-muted-foreground mb-2">Password must contain:</p>
                {validations.map((rule, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    {rule.valid ? (
                      <Check className="h-3 w-3 text-green-600 font-bold" />
                    ) : (
                      <X className="h-3 w-3 text-red-500" />
                    )}
                    <span className={rule.valid ? "text-green-600 font-medium" : "text-muted-foreground"}>
                      {rule.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="font-bold">Confirm Password</Label>
              <PasswordInput id="confirmPassword" {...resetForm.register("confirmPassword")} />
              {resetForm.formState.errors.confirmPassword && (
                <p className="text-red-500 text-xs font-bold">{resetForm.formState.errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full font-black text-md h-11" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
                </>
              ) : (
                <>
                  <CheckCircle2 className="mr-2 h-4 w-4" /> Reset Password
                </>
              )}
            </Button>
          </form>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-center">
        <Link to="/login" className="flex items-center text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Login
        </Link>
      </CardFooter>
    </Card>
  );
}