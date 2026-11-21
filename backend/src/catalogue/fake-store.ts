export interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    description: string;
    category: string;
    rating: { rate: number; count: number };
}

const productsUrl = 'https://fakestoreapi.com/products';

function isProduct(value: unknown): value is Product {
    if (!value || typeof value !== 'object') return false;

    const product = value as Partial<Product>;
    return (
        Number.isInteger(product.id) &&
        typeof product.title === 'string' &&
        typeof product.price === 'number' &&
        Number.isFinite(product.price) &&
        typeof product.image === 'string' &&
        typeof product.description === 'string' &&
        typeof product.category === 'string' &&
        Number.isFinite(product.rating?.rate) &&
        Number.isInteger(product.rating?.count)
    );
}

export async function fetchProducts(): Promise<Product[]> {
    const response = await fetch(productsUrl, {
        signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) {
        throw new Error(`Fake Store API returned HTTP ${response.status}`);
    }

    const products: unknown = await response.json();
    if (!Array.isArray(products) || !products.every(isProduct)) {
        throw new Error('Fake Store API returned invalid products');
    }

    return products.map(
        ({ id, title, price, image, description, category, rating }) => ({
            id,
            title,
            price,
            image,
            description,
            category,
            rating: { rate: rating.rate, count: rating.count },
        }),
    );
}
