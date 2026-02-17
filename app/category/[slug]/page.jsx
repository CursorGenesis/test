import { categories } from '../../../data/mockData';
import CategoryClient from './CategoryClient';

export async function generateMetadata({ params }) {
    const { slug } = await params;

    const category = categories.find(c => c.slug === slug);

    if (!category) {
        return {
            title: 'Категория не найдена | StroyMarket',
        };
    }

    // Default Russian title for metadata
    // In production, you might want to detect locale or use a default
    return {
        title: `${category.title} | StroyMarket`,
        description: `${category.description}. Лучшие предложения в категории ${category.title} на StroyMarket.`,
        openGraph: {
            title: `${category.title} | StroyMarket`,
            description: category.description,
        },
    };
}

export default async function CategoryPage({ params }) {
    const { slug } = await params;
    return <CategoryClient slug={slug} />;
}
