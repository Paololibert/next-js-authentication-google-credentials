import "next-auth"

declare module "next-auth" {
  interface User {
    role?: {
      name: string
    }
    permissions?: any
  }

  interface Session {
    user: User & {
      role?: {
        name: string
      }
      permissions?: any
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: {
      name: string
    }
    permissions?: any
  }
} 