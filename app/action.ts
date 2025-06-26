"use server";

import { authClient } from "@/lib/auth-client";

// export const signIn = async (email: string, password: string) => {
//   try {
//     await auth.api.signInEmail({
//       body: {
//         email,
//         password,
//       },
//     });

//     return { success: true, message: "Sign in successful" };
//   } catch (error) {
//     const err = error as Error;
//     return { success: false, message: err.message || "Something went wrong" };
//   }
// };

// export const signUp = async (email: string, password: string, username: string) => {
//   try {
//     await auth.api.signUpEmail({
//       body: {
//         email,
//         password,
//         name: username,
//       },
//     });

//     return { success: true, message: "Sign up successful" };
//   } catch (error) {
//     const err = error as Error;
//     return { success: false, message: err.message || "Something went wrong" };
//   }
// };

export const signUpAction = async (email: string, password: string, username: string, name: string) => {
  try {
    await authClient.signUp.email({
      email,
      password,
      username,
      name,
    });

    return { success: true, message: "Sign up successful" };
  } catch (error) {
    const err = error as Error;
    return { success: false, message: err.message || "Something went wrong" };
  }
};

export const signInAction = async (username: string, password: string) => {
  try {
    await authClient.signIn.username({
      username,
      password,
    });

    return { success: true, message: "Sign in successful" };
  } catch (error) {
    const err = error as Error;
    return { success: false, message: err.message || "Something went wrong" };
  }
};
