export interface Product{
    id: string;
    name: string;
    category:string;
    unitPrice: number;
    expirationDate?: string;
    quantityInStock: number;
    creationDate?: string;
    updateDate?: string;
}

export type ProductFormData = Omit<Product, 'id' | 'creationDate' | 'updateDate'>;
