import { User as UserEntity } from '../../entities/User.entity'
import AppDataSource from '../../config/data-source'

export const listAll = async () => {
    return await AppDataSource.getRepository(UserEntity)
        .createQueryBuilder("users")
        .getMany();        
}

export const listByEmail = async (email: string) => {    
    return await AppDataSource.getRepository(UserEntity)
        .createQueryBuilder("users")
        .where(`users.email like :email`, { email })
        .getMany();        
}

export const listById = async (id: number) => {
    return await AppDataSource.getRepository(UserEntity)
        .createQueryBuilder("users")
        .where(`users.id = :id`, { id })
        .getMany();        
}