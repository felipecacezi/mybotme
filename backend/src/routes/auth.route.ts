import { Router } from "express"
import { AuthController } from "../controllers/Auth.controller"
import { Auth } from "../services/auth/auth.service"

const authRouter = Router()
const authService = new Auth()
const authController = new AuthController(
    authService
)

authRouter.post("/login", (req, res) => { authController.login(req, res) })

export default authRouter