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
  }  else if (session.user.role?.name === "USER") {
    redirect("/dashboard/users");
  } else {
    redirect("/dashboard/users");
  }
}