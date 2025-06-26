"use server";

import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export const signIn = async (email: string, password: string) => {
  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
    });

    return { success: true, message: "Sign in successful" };
  } catch (error) {
    const err = error as Error;
    return { success: false, message: err.message || "Something went wrong" };
  }
};

export const signUp = async (email: string, password: string, name: string) => {
  try {
    await auth.api.signUpEmail({
      body: {
        email,
        password,
        name,
      },
    });

    return { success: true, message: "Sign up successful" };
  } catch (error) {
    const err = error as Error;
    console.error("Sign up error:", err);

    return { success: false, message: err.message || "Something went wrong" };
  }
};

export const signOut = async () => {
  try {
    await auth.api.signOut();
    redirect("/");
  } catch (error) {
    const err = error as Error;
    console.error("Sign out error:", err);
    throw new Error(err.message || "Failed to sign out");
  }
};