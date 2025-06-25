import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <section className="text-center p-6 md:p-12 bg-blue-300 text-gray-8000">
        <h1 className="text-4xl font-bold mb-4">Welcome to the Dashboard</h1>
      </section>
      <section className="text-gray-500 mt-6">
        <p className="text-lg">
          Welcome, {session.user?.name || "User"}! You are successfully logged in.
        </p>
      </section>
    </main>
  )
}