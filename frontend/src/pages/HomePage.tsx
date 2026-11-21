import type { Product } from '../api/catalogue';
import { CatalogueData } from '../components/CatalogueData';
import { ProductGrid } from '../components/ProductGrid';

export function HomePage() {
    return (
        <section aria-labelledby="featured-heading">
            <h1 id="featured-heading" className="mb-5 text-2xl font-semibold">
                Featured products
            </h1>
            <CatalogueData<Product[]>
                path="/featured"
                label="featured products"
            >
                {(products) => <ProductGrid products={products} />}
            </CatalogueData>
        </section>
    );
}
