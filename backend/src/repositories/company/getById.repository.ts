import { Company as CompanyInterface } from '../../interfaces/Company.interface';
import { Company as CompanyEntity } from '../../entities/Company.entity';
import AppDataSource from '../../config/data-source';
/**
 * Busca uma empresa pelo seu ID.
 * @param id O ID da empresa a ser buscada.
 * @returns A empresa encontrada ou null se não for encontrada.
 */
export const getCompanyById = async (id: number): Promise<CompanyInterface | null> => {
    const companyRepository = AppDataSource.getRepository(CompanyEntity);
    const company = await companyRepository.findOne({ where: { id } });
    return company || null;
};