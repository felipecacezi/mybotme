import { z } from 'zod'

export const deleteSchema = z.object({
    id: z.number({
        required_error: 'Usuário não encontrado',
        invalid_type_error: 'Usuário inválido'
    }),
});