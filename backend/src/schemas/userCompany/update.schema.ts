import { z } from 'zod';

export const updateUserCompanySchema = z.object({
  idCompany: z.number()
    .int('O ID da empresa deve ser um número inteiro')
    .positive('O ID da empresa deve ser um número positivo')
    .optional(),
  idUser: z.number()
    .int('O ID do usuário deve ser um número inteiro')
    .positive('O ID do usuário deve ser um número positivo')
    .optional(),
  active: z.number().int('O campo "active" deve ser um número inteiro').min(0).max(1).optional(),
});

export type UpdateUserCompanyInput = z.infer<typeof updateUserCompanySchema>;