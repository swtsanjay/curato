import type { Product } from '../api/catalogue';
import { CatalogueData } from '../components/CatalogueData';
import { ProductGrid } from '../components/ProductGrid';

export function SearchPage({ query }: { query: string }) {
    return (
        <section aria-labelledby="search-heading">
            <h1
                id="search-heading"
                className="mb-5 text-3xl font-semibold wrap-anywhere"
            >
                {query ? `Search results for “${query}”` : 'Search products'}
            </h1>
            {query ? (
                <CatalogueData<Product[]>
                    path={`/search?${new URLSearchParams({ q: query })}`}
                    label="search results"
                >
                    {(products) =>
                        products.length ? (
                            <ProductGrid products={products} />
                        ) : (
                            <p>No products match your search.</p>
                        )
                    }
                </CatalogueData>
            ) : (
                <p>Enter a search term to find products.</p>
            )}
        </section>
    );
}
