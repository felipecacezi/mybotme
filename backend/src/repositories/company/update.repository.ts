import { Company as CompanyEntity } from '../../entities/Company.entity';
import AppDataSource from '../../config/data-source';
import { Company as CompanyInterface } from '../../interfaces/Company.interface';
import { UpdateCompanyInput } from '../../schemas/company/update.schema';

/**
 * Atualiza uma empresa existente no banco de dados.
 * @param id O ID da empresa a ser atualizada.
 * @param companyData Os dados parciais da empresa para atualização.
 * @returns A empresa atualizada, incluindo o ID.
 * @throws Error se a empresa não for encontrada.
 */
export const updateCompany = async (id: number, companyData: UpdateCompanyInput): Promise<CompanyInterface> => {
    const companyRepository = AppDataSource.getRepository(CompanyEntity);
    const companyToUpdate = await companyRepository.findOneByOrFail({ id });
    Object.assign(companyToUpdate, companyData);
    const savedCompany = await companyRepository.save(companyToUpdate);
    return savedCompany;
};

