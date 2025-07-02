export interface Company {
    id?: number;
    cnpj: string;
    name: string;
    street?: string;
    district?: string;
    city?: string;
    state?: string;
    country?: string;
    zipcode?: string;
    createdAt?: Date;
    updatedAt?: Date;
    active?: number;
}