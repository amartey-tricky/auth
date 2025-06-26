"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signUpSchema, type signUpData } from "@/lib/schema";
import { signUp } from "@/app/action";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export function SignUpForm() {
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

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4 p-6 shadow rounded-md w-full max-w-md"
    >
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
          className={`px-4 py-2 rounded-md bg-teal-500 text-white font-semibold hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-300 focus:ring-offset-2 transition-colors duration-200 ${isSubmitting || isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
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

