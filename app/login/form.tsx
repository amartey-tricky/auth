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

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 w-full max-w-md mx-auto p-6 bg-white rounded-lg shadow-md"
    >
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
          className={`px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-teal-300 focus:border-teal-300 placeholder:text-gray-300" ${errors.email ? "border-red-500" : "border-gray-300"}`}
          placeholder="john.doe@example.com"
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
        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
      </div>
      <div className="flex flex-col gap-2">
        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={`px-4 py-2 rounded-md bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transition-colors duration-200 ${isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isLoading ? <Loader2 className="animate-spin mr-2 inline-block" /> : "Log In"}
        </button>
        <p className="text-sm text-gray-500">
          Don't have an account?{" "}
          <Link
            href="/signup"
            className="text-teal-500 hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
