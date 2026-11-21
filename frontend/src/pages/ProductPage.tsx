import { priceFormat, type Product } from '../api/catalogue';
import { CatalogueData } from '../components/CatalogueData';
import { EnquiryForm } from '../components/EnquiryForm';

export function ProductPage({ id }: { id: string }) {
    return (
        <CatalogueData<Product>
            path={`/products/${id}`}
            label="product details"
        >
            {(product) => (
                <article className="grid gap-8 md:grid-cols-2">
                    <img
                        alt={product.title}
                        src={product.image}
                        className="h-64 w-full rounded-xl border border-slate-200 bg-white p-6 object-contain md:h-96"
                    />
                    <div className="min-w-0 wrap-anywhere">
                        <p className="mb-2 capitalize text-slate-600">
                            {product.category}
                        </p>
                        <h1 className="mb-4 text-2xl font-semibold sm:text-3xl">
                            {product.title}
                        </h1>
                        <p className="mb-2 text-xl font-semibold">
                            {priceFormat.format(product.price)}
                        </p>
                        <p className="mb-4 text-sm text-slate-600">
                            {product.rating.rate} out of 5 (
                            {product.rating.count} ratings)
                        </p>
                        <p className="leading-relaxed">{product.description}</p>
                        <div className="mt-6">
                            <EnquiryForm productId={product.id} />
                        </div>
                    </div>
                </article>
            )}
        </CatalogueData>
    );
}
