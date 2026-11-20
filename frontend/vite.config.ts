import tailwindcss from '@tailwindcss/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', 'API_PROXY_TARGET');
    const proxy = {
        '/api': env.API_PROXY_TARGET || 'http://127.0.0.1:3001',
    };

    return {
        plugins: [tailwindcss()],
        server: { proxy },
        preview: { proxy },
    };
});
