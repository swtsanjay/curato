import { Router, json, type ErrorRequestHandler } from 'express';
import { getProduct } from '../catalogue/catalogue.ts';
import { sendEnquiry } from '../enquiries/mailer.ts';
import { validateEnquiry } from '../enquiries/validation.ts';

export const enquiriesRouter = Router();

enquiriesRouter.post(
    '/',
    json({ limit: '16kb' }),
    async (request, response) => {
        const result = validateEnquiry(request.body);
        if (result.error !== undefined) {
            response.status(400).json({ message: result.error });
            return;
        }

        const { enquiry } = result;
        const product = await getProduct(enquiry.productId);
        if (!product) {
            response
                .status(404)
                .json({ message: 'This product could not be found.' });
            return;
        }

        await sendEnquiry(enquiry, product);
        response.status(204).end();
    },
);

const handleEnquiryError: ErrorRequestHandler = (
    error,
    _request,
    response,
    _next,
) => {
    if (error.status === 400 || error.status === 413) {
        response
            .status(error.status)
            .json({ message: 'Check your form details and try again.' });
        return;
    }

    console.error('Enquiry could not be sent.');
    response
        .status(502)
        .json({ message: 'We couldn’t send your enquiry. Please try again.' });
};

enquiriesRouter.use(handleEnquiryError);
