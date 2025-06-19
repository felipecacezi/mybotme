import { Auth } from '../../interfaces/Auth.interface'
import { User as UserEntity } from '../../entities/User.entity'
import AppDataSource from '../../config/data-source'

export const auth = async (
    email: string,
    password: string
) => {
    return await AppDataSource.getRepository(UserEntity)
        .createQueryBuilder("user")
        .where(`user.email like :email`, { email })
        .andWhere(`user.password like :password`, { password })
        .getMany();    
}