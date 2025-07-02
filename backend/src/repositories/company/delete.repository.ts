import { Company as CompanyEntity } from '../../entities/Company.entity';
import AppDataSource from '../../config/data-source';

export const deleteCompany = async (companyId: number) => {
  const result = await AppDataSource.getRepository(CompanyEntity)
    .createQueryBuilder()
    .update(CompanyEntity)
    .set({ active: 2 }) // Exclusão lógica: marca como inativa
    .where('id = :id', { id: companyId })
    .execute();

  if (result.affected === 0) {
    throw new Error('Empresa inválida');
  }

  return { id: companyId };
};
