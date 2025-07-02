import { z } from 'zod';

export const deleteUserCompanySchema = z.object({
  id: z.number({
    required_error: 'O ID do relacionamento é obrigatório para exclusão',
    invalid_type_error: 'O ID do relacionamento deve ser um número'
  }).int('O ID do relacionamento deve ser um número inteiro').positive('O ID do relacionamento deve ser um número positivo'),
});

export type DeleteUserCompanyInput = z.infer<typeof deleteUserCompanySchema>;

export const userCompanyIdSchema = z.number({
  invalid_type_error: 'O ID do relacionamento deve ser um número',
  required_error: 'ID do relacionamento não fornecido'
}).int('O ID do relacionamento deve ser um número inteiro').positive('O ID do relacionamento deve ser um número positivo');