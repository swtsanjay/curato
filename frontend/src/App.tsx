import type { CategoryLink } from './api/catalogue';
import { CatalogueData } from './components/CatalogueData';
import { SearchBar } from './components/SearchBar';
import { CategoryPage } from './pages/CategoryPage';
import { HomePage } from './pages/HomePage';
import { ProductPage } from './pages/ProductPage';
import { SearchPage } from './pages/SearchPage';

export function App() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    const query =
        new URLSearchParams(window.location.search).get('q')?.trim() ?? '';
    const category = /^\/categories\/([a-z0-9-]+)$/.exec(path);
    const product = /^\/products\/(\d+)$/.exec(path);

    let page = <h1 className="text-2xl font-semibold">Page not found</h1>;
    if (path === '/') page = <HomePage />;
    if (path === '/search') page = <SearchPage query={query} />;
    if (category) page = <CategoryPage slug={category[1]} />;
    if (product) page = <ProductPage id={product[1]} />;

    return (
        <div className="text-slate-900">
            <header className="border-b border-slate-200">
                <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <a
                            href="/"
                            className="text-3xl font-semibold tracking-tight"
                        >
                            Curato
                        </a>
                        <SearchBar query={query} />
                    </div>
                    <nav aria-label="Product categories" className="mt-4">
                        <CatalogueData<CategoryLink[]>
                            path="/categories"
                            label="categories"
                        >
                            {(categories) => (
                                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                                    {categories.map(({ name, slug }) => (
                                        <li key={slug}>
                                            <a
                                                href={`/categories/${slug}`}
                                                aria-current={
                                                    slug === category?.[1]
                                                        ? 'page'
                                                        : undefined
                                                }
                                                className="inline-flex min-h-10 items-center text-sm capitalize hover:underline aria-[current=page]:font-semibold aria-[current=page]:underline"
                                            >
                                                {name}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </CatalogueData>
                    </nav>
                </div>
            </header>
            <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 sm:py-12">
                {page}
            </main>
        </div>
    );
}
