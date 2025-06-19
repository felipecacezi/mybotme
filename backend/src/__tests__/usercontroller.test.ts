import request from 'supertest';
import { UserController } from '../controllers/User.controller';
import { Create } from '../services/users/create.service';
import { User } from '../interfaces/User.interface'
import { Request, Response } from 'express';

describe('UserController methods tests', () => {
    var createServiceMock: jest.Mocked<Create>;
    var controller: UserController;

    beforeEach(() => {
        createServiceMock = {
            init: jest.fn(),
            validate: jest.fn(),
            execute: jest.fn(),
        } as unknown as jest.Mocked<Create>;

        controller = new UserController(createServiceMock);
    });
    it('deve cadastrar com sucesso', async () => {
        const inputData: User = {
            name: 'TesteUser',
            email: 'test@test.com',
            password: 'test123'
        }
        const expectedRespose = {
            id: 1,
            ...inputData
        }
        const jsonMock = jest.fn();
        const statusMock = jest.fn(() => ({ json: jsonMock }));
        const req = { body: inputData, } as Request;
        const res = { status: statusMock } as unknown as Response;

        createServiceMock.execute.mockResolvedValue(expectedRespose)
        const result = await controller.create(req, res)

        expect(createServiceMock.init).toHaveBeenCalledWith(inputData)
        expect(statusMock).toHaveBeenCalledWith(201)
    })
})