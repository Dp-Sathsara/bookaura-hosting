import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { auth, googleProvider, signInWithPopup } from "@/firebase";

interface SocialLoginProps {
  onSocialAuthSuccess?: (user: any) => void;
  isLoading?: boolean;
}

export function SocialLogin({ onSocialAuthSuccess, isLoading: isExternalLoading }: SocialLoginProps) {
  const [country, setCountry] = useState("Detecting...");
  const { login } = useAuth();
  const { toast } = useToast();
  const [internalLoading, setInternalLoading] = useState(false);
  const isLoading = isExternalLoading || internalLoading;

  useEffect(() => {
    fetch("https://ipapi.co/json/")
      .then((res) => res.json())
      .then((data) => {
        if (data.country_name) {
          setCountry(data.country_name);
        } else {
          setCountry("Sri Lanka");
        }
      })
      .catch(() => setCountry("Sri Lanka"));
  }, []);

  const handleSocialLogin = async (provider: string) => {
    setInternalLoading(true);
    console.log(`Logging in with ${provider}...`);

    try {
      if (provider === "Google") {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        if (onSocialAuthSuccess) {
          onSocialAuthSuccess(user);
        } else {
          // Fallback if no callback provided (e.g., on Login page)
          const mockSocialUser = {
            username: user.displayName || "Google User",
            email: user.email,
            provider: "google",
            imageUrl: user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=random`,
            role: 'CUSTOMER'
          };

          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/social-login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(mockSocialUser),
          });

          if (!response.ok) {
            throw new Error('Social login failed');
          }

          const data = await response.json();
          const userWithToken = { ...data.user, token: data.token };
          login(userWithToken);

          toast({
            title: "Login Successful",
            description: `Welcome back, ${userWithToken.username || userWithToken.name}!`,
          });
        }
      } else {
        // SIMULATED Social Login Data for others
        const mockSocialUser = {
          username: `${provider} User`,
          email: `${provider.toLowerCase()}_user@example.com`,
          provider: provider.toLowerCase(),
          imageUrl: `https://ui-avatars.com/api/?name=${provider}+User&background=random`,
          role: 'CUSTOMER'
        };

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth/social-login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockSocialUser),
        });

        if (!response.ok) {
          throw new Error('Social login failed');
        }

        const data = await response.json();
        const userWithToken = { ...data.user, token: data.token };
        login(userWithToken);

        toast({
          title: "Login Successful",
          description: `Welcome back, ${userWithToken.username || userWithToken.name}!`,
        });
      }

    } catch (error: any) {
      console.error("Social login error:", error);
      toast({
        title: "Login Failed",
        description: error.message || "Could not authenticate with social provider.",
        variant: "destructive",
      });
    } finally {
      setInternalLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col items-center gap-4 mt-6">
      {/* Divider */}
      <div className="relative w-full">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Social Buttons Row */}
      <div className="flex justify-center gap-4 w-full mt-2">
        {/* Google */}
        <Button
          type="button"
          variant="outline"
          className="rounded-full w-12 h-12 p-0 border-gray-300 hover:bg-gray-100"
          onClick={() => handleSocialLogin("Google")}
          disabled={isLoading}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
        </Button>

        {/* Facebook */}
        <Button
          type="button"
          variant="outline"
          className="rounded-full w-12 h-12 p-0 border-gray-300 hover:bg-blue-50"
          onClick={() => handleSocialLogin("Facebook")}
          disabled={isLoading}
        >
          <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#1877F2">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </Button>

        {/* Apple */}
        <Button
          type="button"
          variant="outline"
          className="rounded-full w-12 h-12 p-0 border-gray-300 hover:bg-gray-100"
          onClick={() => handleSocialLogin("Apple")}
          disabled={isLoading}
        >
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74 1.18 0 2.48-1.23 3.93-1.08 1.63.16 2.87.82 3.65 1.95-3.23 1.93-2.69 6.77.89 8.28-.73 1.85-1.63 3.66-3.55 3.08zm-2.58-13.6c.55-2.28 2.21-3.68 4.2-3.75.46 2.64-2.52 5.09-4.2 3.75z" />
          </svg>
        </Button>

        {/* X (Twitter) */}
        <Button
          type="button"
          variant="outline"
          className="rounded-full w-12 h-12 p-0 border-gray-300 hover:bg-gray-100"
          onClick={() => handleSocialLogin("Twitter")}
          disabled={isLoading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </Button>
      </div>

      {/* Location Detection */}
      <div className="text-center mt-4">
        <p className="text-xs text-muted-foreground">
          Location: <span className="font-bold text-foreground">{country}</span> 🇱🇰
        </p>

        <p className="text-[10px] text-muted-foreground mt-2 max-w-xs mx-auto text-center leading-tight">
          By continuing, you confirm that you are an adult and have read and accepted our Privacy Policy.
        </p>
      </div>
    </div>
  );
}