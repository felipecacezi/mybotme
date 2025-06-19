import { Request, Response } from "express";


import { Auth } from "../services/auth/auth.service"

export class AuthController {
    constructor(
        private authService: Auth
    ) {}

    async login(req: Request, res: Response){
        try {
            const email = req.body.email
            const password = req.body.password
            const jwtToken = await this.authService.init(email, password)

            return res.status(200).json({
                message: 'Login efetuado com sucesso',
                token: jwtToken
            })
        } catch (error: any) {
            const statusCode = error.statusCode ?? 500;
            return res.status(statusCode).json({
                message: error.errors
            });   
        }        
    }
}