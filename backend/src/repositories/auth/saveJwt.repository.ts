import { Auth } from '../../interfaces/Auth.interface'
import { User } from '../../interfaces/User.interface'
import { User as UserEntity } from '../../entities/User.entity'
import AppDataSource from '../../config/data-source'
import { updateUser } from '../../repositories/users/update.repository'

import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRES_IN } from "../../config/jwt"

export const saveJwtToken = async (arUser: User) => {    
    const jwt_token = await jwt.sign(
        {
            id: arUser.id,
            name: arUser.name,
            email: arUser.email,
            password: arUser.password
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    )

    if (!arUser?.id) {
        throw{ status: 500, message: 'Ocorreu um erro desconhecido ao fazer o login'}
    }
    arUser.jwt_token = jwt_token;
    return (await updateUser(arUser, arUser.id)).jwt_token
}