import HomeClient from './HomeClient';

export const metadata = {
    title: 'Home | StroyMarket - Rental, Services, Jobs',
    description: 'Platform #1 for construction in Kyrgyzstan. Find machinery, a team or a job in a few clicks.',
    keywords: ['machinery', 'rental', 'construction', 'jobs', 'services', 'Kyrgyzstan', 'Bishkek', 'vacancies', 'building materials'],
};

export default function Home() {
    return <HomeClient />;
}
