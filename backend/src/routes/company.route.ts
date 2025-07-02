import { Router, Request, Response } from "express"
import { CompanyController } from "../controllers/Company.controller"
import { Create } from "../services/company/create.service"
import { ListAll } from "../services/company/listAll.service"
import { Delete } from "../services/company/delete.service"
import { Update } from "../services/company/update.service"
// import { authenticated } from '../middlewares/auth.middleware'

const companyRouter = Router()
const createCompanyService = new Create()
const updateCompanyService = new Update()
const deleteCompanyService = new Delete()
const listCompanyService = new ListAll()
const companyController = new CompanyController(
    createCompanyService,
    updateCompanyService,
    deleteCompanyService,
    listCompanyService
)

companyRouter.post('/create', (req: Request, res: Response)=> { companyController.create(req, res) })
companyRouter.patch('/update/:id', (req: Request, res: Response)=> { companyController.update(req, res) })
companyRouter.get('/list', (req: Request, res: Response)=> { companyController.list(req, res) })
companyRouter.delete('/delete/:id', (req: Request, res: Response)=> { companyController.delete(req, res) })
export default companyRouter