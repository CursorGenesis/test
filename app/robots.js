export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin/', '/profile/'],
        },
        sitemap: 'https://stroymarket.kg/sitemap.xml',
    };
}
