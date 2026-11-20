import { useRef, useState, type FormEvent } from 'react';

type Submission =
    | { status: 'idle' | 'sending' | 'sent' }
    | { status: 'error'; message: string };

const fieldClass = 'w-full rounded-md border border-slate-300 px-3 py-2';
const buttonClass =
    'rounded-md bg-slate-900 px-4 py-2 font-semibold text-white enabled:cursor-pointer disabled:opacity-60';
const sendError = 'We couldn’t send your enquiry. Please try again.';

export function EnquiryForm({ productId }: { productId: number }) {
    const [open, setOpen] = useState(false);
    const [submission, setSubmission] = useState<Submission>({
        status: 'idle',
    });
    const inFlight = useRef(false);

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (inFlight.current) return;
        inFlight.current = true;

        const { name, email, message } = Object.fromEntries(
            new FormData(event.currentTarget),
        );
        setSubmission({ status: 'sending' });

        try {
            const response = await fetch('/api/enquiries', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId, name, email, message }),
            });
            if (response.status === 204) {
                setSubmission({ status: 'sent' });
                return;
            }

            const error = await response.json();
            setSubmission({
                status: 'error',
                message:
                    typeof error?.message === 'string'
                        ? error.message
                        : sendError,
            });
        } catch {
            setSubmission({ status: 'error', message: sendError });
        } finally {
            inFlight.current = false;
        }
    }

    if (!open) {
        return (
            <button
                type="button"
                className={buttonClass}
                onClick={() => setOpen(true)}
            >
                Enquire
            </button>
        );
    }

    if (submission.status === 'sent') {
        return (
            <p role="status" className="text-green-700">
                Thank you. We’ve received your enquiry.
            </p>
        );
    }

    const sending = submission.status === 'sending';

    return (
        <form
            aria-labelledby="enquiry-heading"
            onSubmit={submit}
            className="max-w-md space-y-4"
        >
            <h2 id="enquiry-heading" className="text-xl font-semibold">
                Enquire about this product
            </h2>
            <fieldset disabled={sending} className="min-w-0 space-y-4">
                <label className="block">
                    <span className="mb-1 block font-medium">Name</span>
                    <input
                        className={fieldClass}
                        name="name"
                        autoComplete="name"
                        required
                        maxLength={100}
                    />
                </label>
                <label className="block">
                    <span className="mb-1 block font-medium">Email</span>
                    <input
                        className={fieldClass}
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        maxLength={254}
                    />
                </label>
                <label className="block">
                    <span className="mb-1 block font-medium">
                        Message (optional)
                    </span>
                    <textarea
                        className={fieldClass}
                        name="message"
                        rows={4}
                        maxLength={2000}
                    />
                </label>
                <button type="submit" className={buttonClass}>
                    {sending ? 'Sending…' : 'Send enquiry'}
                </button>
            </fieldset>
            {sending && <p role="status">Sending your enquiry…</p>}
            {submission.status === 'error' && (
                <p role="alert" className="text-red-700">
                    {submission.message}
                </p>
            )}
        </form>
    );
}
