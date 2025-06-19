import { z } from 'zod'

export const authSchema = z.object({
  email: z.string().email("O email é obrigatório"),
  password: z.string().min(6, "A senha é obrigatória"),
});