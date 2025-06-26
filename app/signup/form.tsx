"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type signUpData } from "@/lib/schema";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";
import { signUp } from "@/app/action";
import { authClient } from "@/lib/auth-client";

export function SignUpForm() {
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
  } = useForm<signUpData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      // username: "",
      name: "",
    },
  });

  const onSubmit = async (data: signUpData) => {
    setIsLoading(true);

    const { success, message } = await signUp(data.email, data.password, data.name);

    if (success) {
      toast.success(message);
      reset();
      router.push("/login");
    } else {
      toast.error(message);
    }

    setIsLoading(false);
  };

  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);
    
    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
      
      // Handle the result if needed
      if (result?.error) {
        toast.error("Google sign-in failed. Please try again.");
      }
    } catch (error) {
      console.error("Google sign-in error:", error);
      toast.error("Google sign-in failed. Please try again.");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-6 shadow rounded-md w-full max-w-md"
    >
      <button
        type="button"
        onClick={signInWithGoogle}
        className="flex items-center justify-center gap-3 px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transition-colors duration-200 cursor-pointer"
      >
        {/*<svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <title>Google logo</title>
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg> */}
        <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/120px-Google_Favicon_2025.svg.png?20250526093708" alt="Google logo" width={24} height={24} loading="lazy" />
        Continue with Google
      </button>

      {/* Divider */}
      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-gray-300"></div>
        <span className="text-sm text-gray-500">or</span>
        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <div className="flex flex-col gap-2 w-full">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          {...register("name")}
          className={`px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-teal-300 focus:border-teal-300 placeholder:text-gray-300" ${errors.name ? "border-red-500" : "border-gray-300"}`}
          placeholder="John Doe"
        />
        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
      </div>
      {/* <div className="flex flex-col gap-2">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          {...register("username")}
          className={`px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-teal-300 focus:border-teal-300 placeholder:text-gray-300" ${errors.username ? "border-red-500" : "border-gray-300"}`}
          placeholder="johndoe"
        />
        {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}
      </div> */}
      <div className="flex flex-col gap-2">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          {...register("email")}
          className={`px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-teal-300 focus:border-teal-300 placeholder:text-gray-300" ${errors.email ? "border-red-500" : "border-gray-300"}`}
          placeholder="johndoe@example.com"
        />
        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="password">Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("password")}
            className={`px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-teal-300 focus:border-teal-300 placeholder:text-gray-300 w-full ${errors.password ? "border-red-500" : "border-gray-300"}`}
            placeholder="********"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 ease-in-out duration-200 hover:text-teal-300 text-gray-300"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            {...register("confirmPassword")}
            className={`px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-teal-300 focus:border-teal-300 placeholder:text-gray-300 w-full ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
            placeholder="********"
          />
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 ease-in-out duration-200 hover:text-teal-300 text-gray-300"
          >
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`px-4 py-2 rounded-md bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transition-colors duration-200 cursor-pointer ${isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? <Loader2 className="animate-spin mr-2 inline-block" /> : "Sign Up"}
        </button>
        <p className="text-sm text-gray-500">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-teal-500 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </form>
  );
}
