import { fetchProducts } from './fake-store.ts';

const featuredProductIds = [1, 2, 3, 4, 5];

export async function getFeaturedProducts() {
    const products = await fetchProducts();
    const productsById = new Map(
        products.map((product) => [product.id, product]),
    );

    return featuredProductIds.map((id) => {
        const product = productsById.get(id);
        if (!product) throw new Error(`Featured product ${id} is missing`);
        return product;
    });
}

function categorySlug(name: string) {
    return name
        .toLowerCase()
        .replaceAll("'", '')
        .replace(/\W+/g, '-')
        .replace(/^-|-$/g, '');
}

export async function getCategories() {
    const products = await fetchProducts();
    const names = [...new Set(products.map(({ category }) => category))];
    return names.sort().map((name) => ({ name, slug: categorySlug(name) }));
}

export async function getCategory(slug: string) {
    const products = await fetchProducts();
    const matches = products.filter(
        ({ category }) => categorySlug(category) === slug,
    );
    if (matches.length === 0) return undefined;

    matches.sort((a, b) => b.rating.rate - a.rating.rate || a.id - b.id);
    return {
        name: matches[0].category,
        topRated: matches.slice(0, 3),
        remaining: matches.slice(3),
    };
}

export async function searchProducts(query: string) {
    const term = query.trim().toLowerCase();
    if (!term) return [];

    const products = await fetchProducts();
    return products.filter(
        ({ title, description }) =>
            title.toLowerCase().includes(term) ||
            description.toLowerCase().includes(term),
    );
}

export async function getProduct(id: number) {
    if (!Number.isSafeInteger(id) || id < 1) return undefined;

    const products = await fetchProducts();
    return products.find((product) => product.id === id);
}
