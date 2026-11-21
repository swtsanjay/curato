export interface Enquiry {
    productId: number;
    name: string;
    email: string;
    message: string;
}

export function validateEnquiry(body: unknown) {
    if (!body || typeof body !== 'object') {
        return { error: 'Enter your contact details and try again.' };
    }

    const input = body as Partial<Enquiry>;
    const { productId } = input;
    const name = typeof input.name === 'string' ? input.name.trim() : '';
    const email = typeof input.email === 'string' ? input.email.trim() : '';
    const message =
        typeof input.message === 'string' ? input.message.trim() : '';

    if (
        typeof productId !== 'number' ||
        !Number.isSafeInteger(productId) ||
        productId < 1
    ) {
        return { error: 'Choose a valid product to enquire about.' };
    }
    if (!name || name.length > 100 || /[\r\n\x00]/.test(name)) {
        return { error: 'Enter a name of up to 100 characters.' };
    }
    if (
        email.length > 254 ||
        !/^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(email)
    ) {
        return { error: 'Enter a valid email address.' };
    }
    if (
        (input.message !== undefined && typeof input.message !== 'string') ||
        message.length > 2000
    ) {
        return { error: 'Enter a message of up to 2,000 characters.' };
    }

    return { enquiry: { productId, name, email, message } };
}
