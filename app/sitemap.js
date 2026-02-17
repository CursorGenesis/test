import { categories } from '../data/mockData';

export default function sitemap() {
    const baseUrl = 'https://stroymarket.kg'; // Replace with actual domain

    // Static routes
    const routes = [
        '',
        '/about',
        '/contacts',
        '/help',
        '/safety',
        '/terms',
        '/vacancies',
        '/submit',
        '/search',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: route === '' ? 1 : 0.8,
    }));

    // Dynamic category routes
    const categoryRoutes = categories.map((cat) => ({
        url: `${baseUrl}/category/${cat.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.9,
    }));

    // In a real app, you would also fetch all listings IDs here
    // const listings = await getListings();
    // const listingRoutes = listings.map(...)

    return [...routes, ...categoryRoutes];
}
