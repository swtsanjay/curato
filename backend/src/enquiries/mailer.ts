import nodemailer from 'nodemailer';
import type { Product } from '../catalogue/fake-store.ts';
import type { Enquiry } from './validation.ts';

const smtp = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? '127.0.0.1',
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
    connectionTimeout: 5000,
    greetingTimeout: 5000,
    socketTimeout: 10000,
});

export async function sendEnquiry(enquiry: Enquiry, product: Product) {
    const salesInbox = process.env.SALES_EMAIL ?? 'sales@curato.test';
    const result = await smtp.sendMail({
        from: process.env.SMTP_FROM ?? 'catalogue@curato.test',
        to: salesInbox,
        replyTo: { name: enquiry.name, address: enquiry.email },
        subject: `Product enquiry #${product.id}`,
        text: [
            `Product: ${product.title} (ID ${product.id})`,
            `Name: ${enquiry.name}`,
            `Email: ${enquiry.email}`,
            '',
            enquiry.message,
        ].join('\n'),
        disableFileAccess: true,
        disableUrlAccess: true,
    });

    if (result.accepted.length === 0 || result.rejected.length > 0) {
        throw new Error('SMTP did not accept the sales recipient');
    }
}
