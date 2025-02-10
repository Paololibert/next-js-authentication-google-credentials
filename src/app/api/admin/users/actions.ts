'use server'

import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const UpdateUserSchema = z.object({
  userId: z.string(),
  roleId: z.string(),
  permissions: z.array(z.string()).optional(),
})

export async function getUsers() {
  try {
    const session = await auth()
    
    if (session?.user?.role?.name !== "ADMIN") {
      throw new Error("Non autorisé")
    }

    const users = await prisma.user.findMany({
      include: {
        role: true,
        permissions: {
          include: {
            permission: true
          }
        }
      }
    })

    return { success: true, data: users }
  } catch (error) {
    console.error("Erreur dans getUsers:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Une erreur est survenue" 
    }
  }
}

export async function updateUser(formData: FormData) {
  try {
    const session = await auth()
    
    if (session?.user?.role?.name !== "ADMIN") {
      throw new Error("Non autorisé")
    }

    const parsed = UpdateUserSchema.safeParse({
      userId: formData.get('userId'),
      roleId: formData.get('roleId'),
      permissions: formData.getAll('permissions'),
    })

    if (!parsed.success) {
      throw new Error("Données invalides")
    }

    const { userId, roleId, permissions } = parsed.data

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        roleId,
        permissions: {
          deleteMany: {},
          create: permissions?.map(permissionId => ({
            permission: {
              connect: { id: permissionId }
            }
          }))
        }
      }
    })

    revalidatePath('/dashboard/admins/users')
    return { 
      success: true, 
      data: updatedUser, 
      message: "Utilisateur mis à jour" 
    }

  } catch (error) {
    console.error("Erreur dans updateUser:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la mise à jour" 
    }
  }
}

export async function deleteUser(userId: string) {
  try {
    const session = await auth()
    
    if (session?.user?.role?.name !== "ADMIN") {
      throw new Error("Non autorisé")
    }

    if (!userId) {
      throw new Error("ID utilisateur requis")
    }

    await prisma.user.delete({
      where: { id: userId }
    })

    revalidatePath('/dashboard/admins/users')
    return { 
      success: true, 
      message: "Utilisateur supprimé" 
    }

  } catch (error) {
    console.error("Erreur dans deleteUser:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Une erreur est survenue lors de la suppression" 
    }
  }
} 