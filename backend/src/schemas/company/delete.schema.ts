import { z } from 'zod';

export const deleteCompanySchema = z.object({
  id: z.number({
    required_error: 'O ID da empresa é obrigatório para exclusão',
    invalid_type_error: 'O ID da empresa deve ser um número'
  }).int('O ID da empresa deve ser um número inteiro').positive('O ID da empresa deve ser um número positivo'),
});

export type DeleteCompanyInput = z.infer<typeof deleteCompanySchema>;

export const companyIdSchema = z.number({
  invalid_type_error: 'O ID da empresa deve ser um número',
  required_error: 'ID da empresa não fornecido'
}).int('O ID da empresa deve ser um número inteiro').positive('O ID da empresa deve ser um número positivo');