import type { Product } from '../api/catalogue';
import { ProductCard } from './ProductCard';

export function ProductGrid({ products }: { products: Product[] }) {
    return (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {products.map((product) => (
                <li key={product.id} className="min-w-0">
                    <ProductCard product={product} />
                </li>
            ))}
        </ul>
    );
}
