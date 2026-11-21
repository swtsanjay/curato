import { useEffect, useState, type ReactNode } from 'react';
import { CatalogueError, getCatalogue } from '../api/catalogue';

type State<T> =
    | { status: 'loading' }
    | { status: 'error'; notFound: boolean }
    | { status: 'ready'; data: T };

export function CatalogueData<T>({
    path,
    label,
    children,
}: {
    path: string;
    label: string;
    children: (data: T) => ReactNode;
}) {
    const [state, setState] = useState<State<T>>({ status: 'loading' });
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        getCatalogue<T>(path, controller.signal)
            .then((data) => {
                if (!controller.signal.aborted)
                    setState({ status: 'ready', data });
            })
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    setState({
                        status: 'error',
                        notFound:
                            error instanceof CatalogueError &&
                            error.status === 404,
                    });
                }
            });

        return () => controller.abort();
    }, [path, attempt]);

    if (state.status === 'ready') return children(state.data);
    if (state.status === 'loading') {
        return (
            <p className="text-slate-600" role="status">
                Loading {label}…
            </p>
        );
    }

    return (
        <div className="rounded-xl border border-slate-200 p-4">
            <p role="alert">
                {state.notFound
                    ? 'This catalogue page could not be found.'
                    : `We couldn’t load ${label}. Please try again.`}
            </p>
            {!state.notFound && (
                <button
                    type="button"
                    className="mt-3 cursor-pointer rounded-md bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                    onClick={() => {
                        setState({ status: 'loading' });
                        setAttempt((previous) => previous + 1);
                    }}
                >
                    Try again
                </button>
            )}
        </div>
    );
}
