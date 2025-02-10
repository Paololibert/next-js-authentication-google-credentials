import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role?.name === "ADMIN") {
    console.log("Redirection vers le dashboard admins");
    redirect("/dashboard/admins");
  } else {
    redirect("/dashboard/users");
  }
}