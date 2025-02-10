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

export default async function UserProfilePage() {
  const session = await auth()
  
  if (!session?.user) {
    redirect("/login")
  }

  const { data: profile } = await getProfile()

  if (!profile) {
    redirect("/dashboard")
  }

  // Éviter l'erreur TypeScript en appliquant une valeur par défaut
  const sanitizedProfile = {
    ...profile,
    name: profile.name ?? "Utilisateur inconnu", // Valeur par défaut si null
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Mon Profil</CardTitle>
          <CardDescription>
            Gérez vos informations personnelles
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProfileForm profile={sanitizedProfile} />
        </CardContent>
      </Card>
    </div>
  )
}
