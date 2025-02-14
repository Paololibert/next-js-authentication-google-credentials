'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import bcrypt from 'bcryptjs'

// Schéma simplifié sans rôle ni permissions
const UpdateProfileSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères").optional(),
  email: z.string().email("Email invalide").optional(),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères").optional(),
})

export async function getProfile() {
  try {
    const session = await auth()
    
    if (!session?.user) {
      throw new Error("Non authentifié")
    }

    const profile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        role: {
          select: {
            name: true
          }
        }
      }
    })

    if (!profile) {
      throw new Error("Profil non trouvé")
    }

    return { success: true, data: profile }
  } catch (error) {
    console.error("Erreur dans getProfile:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Une erreur est survenue" 
    }
  }
}

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user) {
      throw new Error("Non authentifié");
    }

    const parsed = UpdateProfileSchema.safeParse({
      name: formData.get("name") || undefined,
      email: formData.get("email") || undefined,
      password: formData.get("password") || undefined,
    });

    if (!parsed.success) {
      throw new Error("Données invalides");
    }

    const { name, email, password } = parsed.data;

    // Préparer les données de mise à jour
    const updateData: { name?: string; email?: string; hashedPassword?: string } = {};

    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (password) updateData.hashedPassword = await bcrypt.hash(password, 10);

    const updatedProfile = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    // Revalider le chemin approprié selon le rôle
    const isAdmin = session.user.role?.name === "ADMIN";
    revalidatePath(isAdmin ? "/dashboard/admins/profile" : "/dashboard/users/profile");

    return {
      success: true,
      data: updatedProfile,
      message: "Profil mis à jour avec succès",
    };
  } catch (error) {
    console.error("Erreur dans updateProfile:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour",
    };
  }
}

