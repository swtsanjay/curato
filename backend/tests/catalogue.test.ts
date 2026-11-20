import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
    getCategories,
    getCategory,
    getFeaturedProducts,
    getProduct,
    searchProducts,
} from '../src/catalogue/catalogue.ts';
import type { Product } from '../src/catalogue/fake-store.ts';

const products: Product[] = [
    {
        id: 5,
        title: 'Coat',
        description: 'Fleece lining',
        category: "women's clothing",
        rating: { rate: 5, count: 2 },
        image: 'coat.png',
        price: 45,
    },
    {
        id: 4,
        title: 'USB cable',
        description: 'Braided',
        category: 'electronics',
        rating: { rate: 3, count: 8 },
        image: 'cable.png',
        price: 10,
    },
    {
        id: 3,
        title: 'Tablet',
        description: 'Ten inch display',
        category: 'electronics',
        rating: { rate: 4, count: 5 },
        image: 'tablet.png',
        price: 99,
    },
    {
        id: 2,
        title: 'Laptop',
        description: 'USB charging',
        category: 'electronics',
        rating: { rate: 4, count: 2 },
        image: 'laptop.png',
        price: 250,
    },
    {
        id: 1,
        title: 'Monitor',
        description: 'High resolution',
        category: 'electronics',
        rating: { rate: 5, count: 3 },
        image: 'monitor.png',
        price: 120,
    },
];

const ids = (items: Product[]) => items.map(({ id }) => id);

test('serves the configured five featured products in order', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => Response.json(products));
    assert.deepEqual(ids(await getFeaturedProducts()), [1, 2, 3, 4, 5]);
});

test('gives categories stable slugs and ranks only their own products', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => Response.json(products));
    assert.deepEqual(await getCategories(), [
        { name: 'electronics', slug: 'electronics' },
        { name: "women's clothing", slug: 'womens-clothing' },
    ]);
    const category = await getCategory('electronics');
    assert.ok(category);
    assert.deepEqual(ids(category.topRated), [1, 2, 3]);
    assert.deepEqual(ids(category.remaining), [4]);
    assert.deepEqual((await getCategory('womens-clothing'))?.remaining, []);
    assert.equal(await getCategory('unknown'), undefined);
});

test('search matches titles and descriptions and handles empty results', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => Response.json(products));
    assert.deepEqual(ids(await searchProducts(' USB ')), [4, 2]);
    assert.deepEqual(await searchProducts('unknown'), []);
    assert.deepEqual(await searchProducts(' '), []);
});

test('finds product details by ID and handles missing IDs', async (t) => {
    t.mock.method(globalThis, 'fetch', async () => Response.json(products));
    assert.deepEqual(await getProduct(2), products[3]);
    assert.equal(await getProduct(99), undefined);
    assert.equal(await getProduct(-1), undefined);
});
