import { z } from 'zod'

export const userSchema = z.object({
  name: z.string({
        required_error: 'O nome é obrigatório',
        invalid_type_error: 'O nome deve ser uma string'
    }).min(3, 'Nome inválido'),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
});