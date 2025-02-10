
import { z } from "zod";
// Credential validation scheme
export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Le mot de passe doit avoir au moins 6 caractères"),
});