import { z } from 'zod';

export const createUserCompanySchema = z.object({
  idCompany: z.number({
    required_error: 'O ID da empresa é obrigatório',
    invalid_type_error: 'O ID da empresa deve ser um número'
  }).int('O ID da empresa deve ser um número inteiro').positive('O ID da empresa deve ser um número positivo'),
  idUser: z.number({
    required_error: 'O ID do usuário é obrigatório',
    invalid_type_error: 'O ID do usuário deve ser um número'
  }).int('O ID do usuário deve ser um número inteiro').positive('O ID do usuário deve ser um número positivo'),
  active: z.number().int('O campo "active" deve ser um número inteiro').min(0).max(1).default(1).optional(), // 0 ou 1
});

export type CreateUserCompanyInput = z.infer<typeof createUserCompanySchema>;