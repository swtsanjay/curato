import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { EnquiryForm } from '../src/components/EnquiryForm';

const fetchMock = jest.fn();
const originalFetch = globalThis.fetch;

beforeEach(() => {
    fetchMock.mockReset();
    globalThis.fetch = fetchMock;
});

afterAll(() => {
    globalThis.fetch = originalFetch;
});

async function openForm() {
    const user = userEvent.setup();
    render(<EnquiryForm productId={3} />);
    await user.click(screen.getByRole('button', { name: 'Enquire' }));
    return user;
}

async function fillContact(user: Awaited<ReturnType<typeof openForm>>) {
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Sam Test');
    await user.type(
        screen.getByRole('textbox', { name: 'Email' }),
        'sam@example.test',
    );
}

test('requires name and email before submission', async () => {
    const user = await openForm();
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(screen.getByRole('textbox', { name: 'Name' })).toBeInvalid();
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInvalid();
    expect(fetchMock).not.toHaveBeenCalled();
});

test('blocks submission when the email format is invalid', async () => {
    const user = await openForm();
    await user.type(screen.getByRole('textbox', { name: 'Name' }), 'Sam Test');
    const email = screen.getByRole('textbox', { name: 'Email' });
    await user.type(email, 'invalid-email');
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(email).toBeInvalid();
    expect(fetchMock).not.toHaveBeenCalled();
});

test('shows pending and thanks the customer only after the delivery response', async () => {
    let finishDelivery!: (response: Pick<Response, 'status'>) => void;
    fetchMock.mockReturnValueOnce(
        new Promise((resolve) => {
            finishDelivery = resolve;
        }),
    );

    const user = await openForm();
    await fillContact(user);
    await user.type(
        screen.getByRole('textbox', { name: 'Message (optional)' }),
        'Is this in stock?',
    );
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(fetchMock).toHaveBeenCalledWith('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            productId: 3,
            name: 'Sam Test',
            email: 'sam@example.test',
            message: 'Is this in stock?',
        }),
    });
    expect(screen.getByRole('status')).toHaveTextContent(
        'Sending your enquiry',
    );
    expect(screen.getByRole('button', { name: 'Sending…' })).toBeDisabled();
    expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument();

    finishDelivery({ status: 204 });
    expect(await screen.findByText(/Thank you/)).toHaveClass('text-green-700');
    expect(screen.queryByRole('form')).not.toBeInTheDocument();
});

test.each([
    { status: 400, message: 'Enter a valid email address.' },
    {
        status: 502,
        message: 'We couldn’t send your enquiry. Please try again.',
    },
])(
    'shows HTTP $status and preserves contact details for retry',
    async ({ status, message }) => {
        fetchMock.mockResolvedValueOnce({
            status,
            json: async () => ({ message }),
        });

        const user = await openForm();
        await fillContact(user);
        await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

        expect(await screen.findByRole('alert')).toHaveTextContent(message);
        expect(screen.getByRole('textbox', { name: 'Email' })).toHaveValue(
            'sam@example.test',
        );
        expect(
            screen.getByRole('button', { name: 'Send enquiry' }),
        ).toBeEnabled();
        expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument();
    },
);

test('recovers from a network error when the customer retries', async () => {
    fetchMock
        .mockRejectedValueOnce(new TypeError('Network unavailable'))
        .mockResolvedValueOnce({ status: 204 });

    const user = await openForm();
    await fillContact(user);
    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(
        'We couldn’t send your enquiry. Please try again.',
    );
    expect(screen.queryByText(/Thank you/)).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Send enquiry' }));
    expect(await screen.findByText(/Thank you/)).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
});
