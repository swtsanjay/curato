export function SearchBar({ query }: { query: string }) {
    return (
        <form
            action="/search"
            role="search"
            className="flex w-full gap-2 sm:max-w-md"
        >
            <label htmlFor="search-query" className="sr-only">
                Search products
            </label>
            <input
                id="search-query"
                className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2"
                type="search"
                name="q"
                placeholder="Search products"
                defaultValue={query}
            />
            <button
                type="submit"
                className="shrink-0 cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
            >
                Search
            </button>
        </form>
    );
}
