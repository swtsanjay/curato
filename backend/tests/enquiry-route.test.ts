import assert from 'node:assert/strict';
import { once } from 'node:events';
import type { AddressInfo } from 'node:net';
import { test } from 'node:test';
import nodemailer, { type SendMailOptions } from 'nodemailer';

test('enquiry endpoint validates submissions and reports SMTP outcomes', async (t) => {
    const product = {
        id: 1,
        title: 'Monitor',
        price: 100,
        image: '',
        category: 'electronics',
        description: '',
        rating: { rate: 5, count: 1 },
    };
    const contact = {
        productId: 1,
        name: ' Sam Test ',
        email: ' sam@example.test ',
        message: 'Is this in stock?',
    };
    const sendMail = t.mock.fn(async (_message: SendMailOptions) => ({
        accepted: ['sales@curato.test'],
        rejected: [] as string[],
    }));
    t.mock.method(nodemailer, 'createTransport', () => ({ sendMail }));
    const localFetch = globalThis.fetch;
    const fetchProducts = t.mock.fn(async () => Response.json([product]));
    t.mock.method(globalThis, 'fetch', fetchProducts);
    const { app } = await import('../src/app.ts');
    const server = app.listen(0, '127.0.0.1');
    t.after(
        () =>
            new Promise<void>((resolve, reject) => {
                server.close((error) => (error ? reject(error) : resolve()));
            }),
    );
    await once(server, 'listening');

    const { port } = server.address() as AddressInfo;
    async function submit(body: unknown) {
        return localFetch(`http://127.0.0.1:${port}/api/enquiries`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
    }

    await t.test(
        'invalid input returns 400 before contacting the product source or SMTP',
        async () => {
            const response = await submit({ ...contact, email: 'invalid' });
            assert.equal(response.status, 400);
            assert.deepEqual(await response.json(), {
                message: 'Enter a valid email address.',
            });
            assert.equal(fetchProducts.mock.callCount(), 0);
            assert.equal(sendMail.mock.callCount(), 0);
        },
    );

    await t.test(
        'accepted mail returns 204 and contains the validated enquiry',
        async () => {
            const response = await submit(contact);
            assert.equal(response.status, 204);
            assert.equal(await response.text(), '');
            assert.equal(sendMail.mock.callCount(), 1);

            const [email] = sendMail.mock.calls[0].arguments;
            assert.equal(
                email.to,
                process.env.SALES_EMAIL ?? 'sales@curato.test',
            );
            assert.deepEqual(email.replyTo, {
                name: 'Sam Test',
                address: 'sam@example.test',
            });
            assert.match(String(email.text), /Monitor \(ID 1\)/);
            assert.match(String(email.text), /Is this in stock\?/);
        },
    );

    await t.test(
        'SMTP rejection or connection failure returns 502',
        async () => {
            t.mock.method(console, 'error', () => {});
            sendMail.mock.mockImplementationOnce(async () => ({
                accepted: [],
                rejected: ['sales@curato.test'],
            }));
            sendMail.mock.mockImplementation(async () => {
                throw new Error('SMTP offline');
            });

            for (let attempt = 0; attempt < 2; attempt++) {
                const response = await submit(contact);
                assert.equal(response.status, 502);
                assert.deepEqual(await response.json(), {
                    message: 'We couldn’t send your enquiry. Please try again.',
                });
            }
            assert.equal(sendMail.mock.callCount(), 3);
        },
    );
});
