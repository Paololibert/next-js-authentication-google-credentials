import "next-auth"

declare module "next-auth" {
  interface User {
    role?: {
      name: string
    }
    permissions?: string[] | string
  }

  interface Session {
    user: User & {
      role?: {
        name: string
      }
        permissions?: string[] | string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: {
      name: string
    }
    permissions?: string[] | string
  }
} 