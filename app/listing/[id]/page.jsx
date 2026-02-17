import { featuredListings } from '../../../data/mockData';
import ListingClient from './ListingClient';

export async function generateMetadata({ params }) {
    const { id } = await params;

    // In a real app, you would fetch data from API
    // Here we check mock data
    const listing = featuredListings.find(l => l.id === parseInt(id));

    if (!listing) {
        return {
            title: 'Объявление не найдено | StroyMarket',
        };
    }

    return {
        title: `${listing.title} - ${listing.price} | StroyMarket`,
        description: listing.description?.slice(0, 160) || 'Детали объявления на StroyMarket',
        openGraph: {
            title: listing.title,
            description: listing.description?.slice(0, 160),
            images: [listing.image],
        },
    };
}

export default async function ListingPage({ params }) {
    const { id } = await params;
    return <ListingClient id={id} />;
}
