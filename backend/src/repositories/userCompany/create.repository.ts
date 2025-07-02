import { UserCompany as UserCompanyInterface } from '../../interfaces/UserCompany.interface';
import { UserCompany as UserCompanyEntity } from '../../entities/UserCompany.entity';
import AppDataSource from '../../config/data-source';

/**
 * Cria um novo relacionamento entre um usuário e uma empresa no banco de dados.
 * @param userCompanyData Os dados do relacionamento a serem criados.
 * @returns Um objeto contendo o ID do relacionamento salvo e os dados fornecidos.
 */
export const createUserCompany = async (userCompanyData: UserCompanyInterface): Promise<UserCompanyInterface> => {
    const userCompanyRepository = AppDataSource.getRepository(UserCompanyEntity);
    const newUserCompany = userCompanyRepository.create(userCompanyData);
    const savedUserCompany = await userCompanyRepository.save(newUserCompany);
    return { id: savedUserCompany.id, ...userCompanyData };
};