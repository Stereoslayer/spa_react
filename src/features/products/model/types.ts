export type Product = {
    id: number | string;
    title: string;
    description: string;
    thumbnail?: string;
    price?: number;
    rating?: number;
};

export type DummyListResponse<T> = {
    products: T[];
    total: number;
    skip: number;
    limit: number;
};

export type DummyProduct = {
    id: number;
    title: string;
    description: string;
    price: number;
    rating: number;
    thumbnail: string;
};