import { Company } from '../../interfaces/Company.interface';
import { deleteCompany } from '../../repositories/company/delete.repository';
import { deleteCompanySchema } from '../../schemas/company/delete.schema';
import { z } from 'zod';

export class Delete {
  async init(id: number): Promise<{ id: number }> {
    await this.validate(id);
    return this.execute(id);
  }

  async validate(id: number): Promise<void> {
    try {
      deleteCompanySchema.parse({ id });
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        throw {
          errors: error.errors.map(e => e.message).join(', '),
          statusCode: 400,
        };
      } else {
        throw {
          errors:
            error.message ?? 'Ocorreu um erro desconhecido ao deletar a empresa.',
          statusCode: error.status ?? 500,
        };
      }
    }
  }

  async execute(id: number): Promise<{ id: number }> {
    return await deleteCompany(id);
  }
}
