import { Company as CompanyInterface } from '../../interfaces/Company.interface';
import { Company as CompanyEntity } from '../../entities/Company.entity';
import AppDataSource from '../../config/data-source';
/**
 * Cria uma nova empresa no banco de dados.
 * @param companyData Os dados da empresa a serem criados.
 * @returns Um objeto contendo o ID da empresa salva e os dados fornecidos.
 */
export const createCompany = async (companyData: CompanyInterface): Promise<CompanyInterface> => {
    const companyRepository = AppDataSource.getRepository(CompanyEntity);
    const newCompany = companyRepository.create(companyData);
    const savedCompany = await companyRepository.save(newCompany);
    return { id: savedCompany.id, ...companyData };
};