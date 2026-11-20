export interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
    rating: { rate: number; count: number };
}

export interface CategoryLink {
    name: string;
    slug: string;
}

export interface Category {
    name: string;
    topRated: Product[];
    remaining: Product[];
}

export class CatalogueError extends Error {
    constructor(readonly status: number) {
        super('Catalogue data could not load.');
    }
}

export async function getCatalogue<T>(
    path: string,
    signal: AbortSignal,
): Promise<T> {
    const response = await fetch(`/api/catalogue${path}`, { signal });
    if (!response.ok) throw new CatalogueError(response.status);

    return response.json();
}

export const priceFormat = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
