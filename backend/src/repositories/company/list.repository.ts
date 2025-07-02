import { Company as CompanyEntity } from '../../entities/Company.entity';
import AppDataSource from '../../config/data-source';

export const listAll = async () => {
  return await AppDataSource.getRepository(CompanyEntity)
    .createQueryBuilder('companies')
    .where('companies.active = :active', { active: 1 })
    .getMany();
};

export const listByCNPJ = async (cnpj: string) => {
  return await AppDataSource.getRepository(CompanyEntity)
    .createQueryBuilder('companies')
    .where('companies.cnpj = :cnpj', { cnpj })
    .andWhere('companies.active = :active', { active: 1 })
    .getMany();
};

export const listById = async (id: number) => {
  return await AppDataSource.getRepository(CompanyEntity)
    .createQueryBuilder('companies')
    .where('companies.id = :id', { id })
    .andWhere('companies.active = :active', { active: 1 })
    .getOne();
};
