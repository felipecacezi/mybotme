import { User as UserEntity } from '../../entities/User.entity'
import AppDataSource from '../../config/data-source'
import { User } from '../../interfaces/User.interface'

export const updateUser = async (user: User, userId: number) => {
    const result = await AppDataSource.getRepository(UserEntity)
    const userEntity = await result.findOneByOrFail({ id: userId });
    Object.assign(userEntity, user)
    await result.save(userEntity)
    return { id: userId, ...user }
}