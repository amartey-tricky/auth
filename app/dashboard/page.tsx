import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { SignOutButton } from "./sign-out-button";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-2xl">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome to the Dashboard</h1>
            <p className="text-lg text-gray-600">
              Welcome, {session.user?.name || "User"}! You are successfully logged in.
            </p>
          </div>
          <SignOutButton />
        </div>
        
        <section className="bg-gradient-to-r from-teal-500 to-blue-500 text-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Your Account</h2>
          <div className="space-y-2">
            <p><span className="font-medium">Name:</span> {session.user?.name}</p>
            <p><span className="font-medium">Email:</span> {session.user?.email}</p>
            <p><span className="font-medium">User ID:</span> {session.user?.id}</p>
          </div>
        </section>
      </div>
    </main>
  );
}