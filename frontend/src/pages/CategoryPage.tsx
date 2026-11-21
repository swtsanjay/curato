import type { Category } from '../api/catalogue';
import { CatalogueData } from '../components/CatalogueData';
import { ProductGrid } from '../components/ProductGrid';

export function CategoryPage({ slug }: { slug: string }) {
    return (
        <CatalogueData<Category>
            path={`/categories/${slug}`}
            label="category products"
        >
            {({ name, topRated, remaining }) => (
                <>
                    <h1 className="mb-6 text-3xl font-semibold capitalize">
                        {name}
                    </h1>
                    <section aria-labelledby="top-rated" className="mb-8">
                        <h2
                            id="top-rated"
                            className="mb-4 text-xl font-semibold"
                        >
                            Top rated
                        </h2>
                        <ProductGrid products={topRated} />
                    </section>
                    <section aria-labelledby="more-products">
                        <h2
                            id="more-products"
                            className="mb-4 text-xl font-semibold"
                        >
                            More products
                        </h2>
                        {remaining.length ? (
                            <ProductGrid products={remaining} />
                        ) : (
                            <p>No additional products in this category.</p>
                        )}
                    </section>
                </>
            )}
        </CatalogueData>
    );
}
