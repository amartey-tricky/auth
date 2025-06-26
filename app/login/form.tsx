"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signInSchema, type signInData } from "@/lib/schema";
import { signIn } from "@/app/action";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { authClient } from "@/lib/auth-client";

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<signInData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: signInData) => {
    setIsLoading(true);

    try {
      const { success, message } = await signIn(data.email, data.password);

      if (success) {
        toast.success(message);
        reset();
        router.push("/dashboard");
      } else {
        toast.error(message);
      }
    } catch (error) {
      const err = error as Error;
      toast.error(err.message || "Something went wrong");
    }

    setIsLoading(false);
  };

  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);
    toast.loading("Redirecting to Google...");
    
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      
      if (result?.error) {
        toast.dismiss();
        toast.error("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.dismiss();
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <button
        type="button"
        onClick={signInWithGoogle}
        disabled={isGoogleLoading}
        className="flex items-center justify-center gap-3 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGoogleLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <Image 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/120px-Google_Favicon_2025.svg.png?20250526093708" 
            alt="Google logo" 
            width={20} 
            height={20} 
            loading="lazy" 
          />
        )}
        {isGoogleLoading ? "Signing in..." : "Continue with Google"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="email"
          className="text-sm font-medium"
        >
          Email
        </label>
        <input
          type="email"
          {...register("email")}
          className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 placeholder:text-gray-400 ${errors.email ? "border-red-500" : "border-gray-300"}`}
          placeholder="john.doe@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className="text-sm font-medium">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className={`px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-teal-300 placeholder:text-gray-400 w-full pr-10 ${errors.password ? "border-red-500" : "border-gray-300"}`}
            placeholder="********"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-teal-500 transition-colors duration-200"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`px-4 py-2 rounded-md bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transition-colors duration-200 ${isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin mr-2 inline-block" />
              Signing in...
            </>
          ) : (
            "Log In"
          )}
        </button>
        <p className="text-sm text-gray-500 text-center">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-teal-500 hover:underline font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}