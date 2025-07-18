import {z} from 'zod';

export const getCompanyByUserId = z.object({
  userId: z.number({
    required_error: 'Usuário não informado',
    invalid_type_error: 'O ID do usuário deve ser um número',
  }).int('O ID do usuário deve ser um número').positive('O ID do usuário deve ser um número positivo'),
});