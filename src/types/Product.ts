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

export interface ProductResponse{
    pagination:{
        currentPage: number;
        pageSize: number;
        totalPages: number;
        totalItems: number;
    };
    data: Product[];
}
export type ProductFormData = Omit<Product, 'id' | 'creationDate' | 'updateDate'>;
