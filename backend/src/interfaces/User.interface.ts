export interface User {
    id?:number;
    name: string;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
    active?: number;
    jwt_token?: string;
}