import { Auth } from '../../interfaces/Auth.interface'
import { User as UserEntity } from '../../entities/User.entity'
import AppDataSource from '../../config/data-source'

export const auth = async (
    email: string,
    password: string
) => {
    return await AppDataSource.getRepository(UserEntity)
        .createQueryBuilder("users")
        .where(`users.email like :email`, { email })
        .andWhere(`users.password like :password`, { password })
        .andWhere(`users.active <> :active`, { active: 2 })
        .getMany();    
}