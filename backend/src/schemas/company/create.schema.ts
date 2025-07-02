import { z } from 'zod';

export const createCompanySchema = z.object({
  cnpj: z.string({
    required_error: 'O CNPJ é obrigatório',
    invalid_type_error: 'O CNPJ deve ser uma string'
  })
  .min(14, 'CNPJ inválido'),
  name: z.string({
    required_error: 'O nome da empresa é obrigatório',
    invalid_type_error: 'O nome deve ser uma string'
  }).min(3, 'O nome da empresa deve ter no mínimo 3 caracteres'),
  street: z.string().max(255, 'A rua não pode exceder 255 caracteres').optional(),
  district: z.string().max(255, 'O bairro não pode exceder 255 caracteres').optional(),
  city: z.string().max(255, 'A cidade não pode exceder 255 caracteres').optional(),
  state: z.string().max(2, 'O estado não pode exceder 255 caracteres').optional(),
  country: z.string().max(255, 'O país não pode exceder 255 caracteres').optional(),
  zipcode: z.string().min(8, 'O CEP deve ter 9 caracteres (incluindo formatação)').optional(), // Ex: "XXXXX-XXX"
  active: z.number().int('O campo "active" deve ser um número inteiro').min(0).max(1).default(1).optional(), // 0 ou 1
});

// Tipo inferido do schema para uso em tipagem
export type CreateCompanyInput = z.infer<typeof createCompanySchema>;