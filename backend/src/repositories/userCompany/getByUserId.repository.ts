import AppDataSource from "../../config/data-source";
import { UserCompany } from "../../entities/UserCompany.entity";
import { Company } from "../../entities/Company.entity";

/**
 * Busca todas as empresas associadas a um usuário específico pelo userId.
 * @param userId ID do usuário.
 * @returns Lista de empresas.
 */
export const getByUserId = async (userId: number): Promise<Company[]> => {
  const userCompanyRepository = AppDataSource.getRepository(UserCompany);

  const userCompanies = await userCompanyRepository.find({
    where: { idUser: userId, active: 1 },
    relations: ['company'],
  });

  const companies = userCompanies.map((userCompany) => userCompany.company);  
  return companies;
};

