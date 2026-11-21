import { Component, type ReactNode } from 'react';

export class AppErrorBoundary extends Component<
    { children: ReactNode },
    { hasError: boolean }
> {
    state = { hasError: false };

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (!this.state.hasError) return this.props.children;

        return (
            <main className="mx-auto max-w-lg px-4 py-12 text-slate-900 sm:px-6">
                <div role="alert">
                    <h1 className="text-2xl font-semibold">
                        Something went wrong
                    </h1>
                    <p className="mt-3 text-slate-600">
                        We couldn’t display this page. Try reloading it.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => window.location.reload()}
                    className="mt-5 cursor-pointer rounded-md bg-slate-900 px-4 py-2 font-semibold text-white"
                >
                    Reload page
                </button>
            </main>
        );
    }
}
