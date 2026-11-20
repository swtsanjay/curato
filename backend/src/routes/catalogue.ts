import { Router, type ErrorRequestHandler } from 'express';
import {
    getCategories,
    getCategory,
    getFeaturedProducts,
    getProduct,
    searchProducts,
} from '../catalogue/catalogue.ts';

export const catalogueRouter = Router();

catalogueRouter.get('/featured', async (_request, response) => {
    response.json(await getFeaturedProducts());
});

catalogueRouter.get('/categories', async (_request, response) => {
    response.json(await getCategories());
});

catalogueRouter.get('/categories/:slug', async (request, response) => {
    const category = await getCategory(request.params.slug);
    if (!category) {
        response.status(404).json({ message: 'Category not found.' });
        return;
    }

    response.json(category);
});

catalogueRouter.get('/search', async (request, response) => {
    const { q } = request.query;
    response.json(await searchProducts(typeof q === 'string' ? q : ''));
});

catalogueRouter.get('/products/:id', async (request, response) => {
    const id = /^\d+$/.test(request.params.id)
        ? Number(request.params.id)
        : NaN;
    const product = await getProduct(id);
    if (!product) {
        response.status(404).json({ message: 'Product not found.' });
        return;
    }

    response.json(product);
});

const handleCatalogueError: ErrorRequestHandler = (
    error,
    _request,
    response,
    _next,
) => {
    console.error('Could not load catalogue data:', error);
    const status = error instanceof URIError ? 400 : 502;
    response.status(status).json({
        message:
            status === 400
                ? 'Invalid catalogue URL.'
                : 'Catalogue data could not load.',
    });
};

catalogueRouter.use(handleCatalogueError);
