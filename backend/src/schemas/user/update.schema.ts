import { z } from 'zod'

export const updateSchema = z.object({
    name: z.string().min(1, 'O nome deve possuir pelo menos 1 caractere').optional(),
    email: z.string().email("Email inválido").optional(),
    password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional(),
});

export const idSchema = z.number({
    message: 'Usuário inválido ou não encontrado'
});