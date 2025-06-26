"use server";

// import { signIn, signUp } from "@/lib/auth-client"
// import { authClient } from "@/lib/auth-client";
import { auth } from "@/lib/auth";

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
    console.error(Error, err);

    return { success: false, message: err.message || "Something went wrong" };
  }
};

// export const signUpAction = async (email: string, password: string, username: string, name: string) => {
//   try {
//     await signUp.email({
//       email,
//       password,
//       username,
//       name,
//     });

//     return { success: true, message: "Sign up successful" };
//   } catch (error) {
//     const err = error as Error;
//     return { success: false, message: err.message || "Something went wrong" };
//   }
// };

// export const signInAction = async (username: string, password: string) => {
//   try {
//     await signIn.username({
//       username,
//       password,
//     });

//     return { success: true, message: "Sign in successful" };
//   } catch (error) {
//     const err = error as Error;
//     return { success: false, message: err.message || "Something went wrong" };
//   }
// };
