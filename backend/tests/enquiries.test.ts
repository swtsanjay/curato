import assert from 'node:assert/strict';
import { test } from 'node:test';
import { validateEnquiry } from '../src/enquiries/validation.ts';

const contact = {
    productId: 1,
    name: ' Sam Test ',
    email: ' sam@example.test ',
};

test('trims contact details and defaults an absent message to empty', () => {
    assert.deepEqual(validateEnquiry(contact), {
        enquiry: {
            productId: 1,
            name: 'Sam Test',
            email: 'sam@example.test',
            message: '',
        },
    });
});

test('rejects invalid product IDs, contact details and message lengths', () => {
    for (const invalid of [
        null,
        { ...contact, productId: '1' },
        { ...contact, productId: -1 },
        { ...contact, name: ' ' },
        { ...contact, name: 'Sam\nTest' },
        { ...contact, email: 'sam@' },
        { ...contact, email: 'sam@example.test\r\nX-Header:value' },
        { ...contact, message: 42 },
        { ...contact, message: 'x'.repeat(2001) },
    ]) {
        assert.ok(validateEnquiry(invalid).error);
    }
});

test('mailer waits for SMTP and rejects unsuccessful deliveries', async (t) => {
    const { default: nodemailer } = await import('nodemailer');
    let settleDelivery!: (result: {
        accepted: string[];
        rejected: string[];
    }) => void;
    const sendMail = t.mock.fn(
        async () =>
            new Promise((resolve) => {
                settleDelivery = resolve;
            }),
    );
    t.mock.method(nodemailer, 'createTransport', () => ({ sendMail }));
    const { sendEnquiry } = await import('../src/enquiries/mailer.ts');
    const enquiry = {
        productId: 1,
        name: 'Sam Test',
        email: 'sam@example.test',
        message: 'Is this in stock?',
    };
    const product = {
        id: 1,
        title: 'Monitor',
        price: 100,
        image: '',
        category: 'electronics',
        description: '',
        rating: { rate: 5, count: 1 },
    };

    let finished = false;
    const delivery = sendEnquiry(enquiry, product).then(() => {
        finished = true;
    });
    assert.equal(finished, false);
    settleDelivery({ accepted: ['sales@curato.test'], rejected: [] });
    await delivery;
    assert.equal(finished, true);

    const rejected = assert.rejects(
        sendEnquiry(enquiry, product),
        /SMTP did not accept/,
    );
    settleDelivery({ accepted: [], rejected: ['sales@curato.test'] });
    await rejected;

    sendMail.mock.mockImplementationOnce(async () => {
        throw new Error('SMTP offline');
    });
    await assert.rejects(sendEnquiry(enquiry, product), /SMTP offline/);
});
