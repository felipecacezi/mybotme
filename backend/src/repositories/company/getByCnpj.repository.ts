import { Company as CompanyInterface } from '../../interfaces/Company.interface';
import { Company as CompanyEntity } from '../../entities/Company.entity';
import AppDataSource from '../../config/data-source';
/**
 * Busca uma empresa pelo seu CNPJ.
 * @param cnpj O CNPJ da empresa a ser buscada.
 * @returns A empresa encontrada ou null se não for encontrada.
 */
export const getCompanyByCnpj = async (cnpj: string): Promise<CompanyInterface | null> => {
    const companyRepository = AppDataSource.getRepository(CompanyEntity);
    const company = await companyRepository.findOne({ where: { cnpj } });
    return company || null;
};