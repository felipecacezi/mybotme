import { z } from 'zod';

export const updateCompanySchema = z.object({
  cnpj: z.string()
    .length(18, 'O CNPJ deve ter 18 caracteres (incluindo formatação)')
    .optional(),
  name: z.string()
    .min(3, 'O nome da empresa deve ter no mínimo 3 caracteres')
    .optional(),
  street: z.string().max(255, 'A rua não pode exceder 255 caracteres').optional(),
  district: z.string().max(255, 'O bairro não pode exceder 255 caracteres').optional(),
  city: z.string().max(255, 'A cidade não pode exceder 255 caracteres').optional(),
  state: z.string().max(255, 'O estado não pode exceder 255 caracteres').optional(),
  country: z.string().max(255, 'O país não pode exceder 255 caracteres').optional(),
  zipcode: z.string().length(9, 'O CEP deve ter 9 caracteres (incluindo formatação)').optional(),
  active: z.number().int('O campo "active" deve ser um número inteiro').min(0).max(1).optional(),
});

// Tipo inferido do schema para uso em tipagem
export type UpdateCompanyInput = z.infer<typeof updateCompanySchema>;