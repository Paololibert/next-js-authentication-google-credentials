import { getProfile } from "@/app/api/users/profile/actions"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/profile-form"
import {
  Card,
  CardContent,

  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default async function AdminProfilePage() {
  const session = await auth()

  if (!session?.user || session.user.role?.name !== "ADMIN") {
    redirect("/login")
  }

  const { data: profile } = await getProfile()

  if (!profile) {
    redirect("/dashboard")
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil Administrateur</CardTitle>
          <CardDescription>
            Gérez vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          {profile && (
            <ProfileForm
              profile={{
                name: profile.name ?? "",
                email: profile.email,
                image: profile.image ?? null,
              }}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
