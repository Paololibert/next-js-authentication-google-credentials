"use client"

import { updateProfile } from "@/app/api/users/profile/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { useState } from "react"
import Image from "next/image"

interface ProfileFormProps {
  profile: {
    name: string
    email: string
    image?: string | null
  }
}

export function ProfileForm({ profile }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(profile.image || null)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(event.currentTarget)
      const result = await updateProfile(formData)

      if (!result.success) {
        throw new Error(result.error)
      }

      toast.success(result.message)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur est survenue")
    } finally {
      setIsLoading(false)
    }
  }

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          {imagePreview && (
            <div className="relative h-20 w-20 rounded-full overflow-hidden">
              <Image
                src={imagePreview}
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="flex-1">
            <Label htmlFor="image">Photo de profil</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="name">Nom</Label>
          <Input
            id="name"
            name="name"
            defaultValue={profile.name}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={profile.email}
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="password">Nouveau mot de passe (optionnel)</Label>
          <Input
            id="password"
            name="password"
            type="password"
            className="mt-1"
          />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Mise à jour..." : "Mettre à jour le profil"}
      </Button>
    </form>
  )
} 