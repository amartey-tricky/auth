import bcrypt from "bcryptjs";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { username } from "better-auth/plugins";
import { db } from "@/db";
import { schema } from "@/db/schema";

const googleClientId = process.env.GOOGLE_CLIENT_ID as string;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET as string;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
    requireEmailVerification: false,
    password: {
      hash: async (password: string) => {
        const saltRounds = 12;
        return await bcrypt.hash(password, saltRounds);
      },
      verify: async ({ password, hash }: { password: string; hash: string }) => {
        return await bcrypt.compare(password, hash);
      },
    },
  },

  socialProviders: {
    google: {
      prompt: "select_account+consent",
      clientId: googleClientId,
      clientSecret: googleClientSecret,
      redirectURI: `${process.env.BETTER_AUTH_URL}/api/auth/callback/google`,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
  },

  plugins: [
    username({
      minUsernameLength: 3,
      maxUsernameLength: 20,
      usernameValidator: (username) => {
        if (username === "admin") {
          return false;
        }
        return true;
      },
    }),
    nextCookies(),
  ],
});
