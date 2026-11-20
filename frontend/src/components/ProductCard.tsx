import { priceFormat, type Product } from '../api/catalogue';

export function ProductCard({ product }: { product: Product }) {
    return (
        <article className="h-full">
            <a
                href={`/products/${product.id}`}
                className="block h-full rounded-xl border border-slate-200 bg-white p-4 hover:border-slate-400 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
                <img
                    alt=""
                    className="mb-4 h-40 w-full object-contain"
                    src={product.image}
                />
                <p className="text-sm font-medium wrap-anywhere">
                    {product.title}
                </p>
                <p className="mt-2 text-sm font-semibold">
                    {priceFormat.format(product.price)}
                </p>
            </a>
        </article>
    );
}
