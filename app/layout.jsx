import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Providers from '@/components/Providers';
import { SidebarAds, PopupAd } from '@/components/AdBanners/AdBanners';
import AnimatedBackground from '@/components/AnimatedBackground/AnimatedBackground';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata = {
    title: {
        default: 'StroyMarket — Construction Marketplace: Machinery, Services, Jobs',
        template: '%s | StroyMarket'
    },
    description: 'Everything for construction in Kyrgyzstan: machinery rental, building materials sales, job search and construction services. Easy search and ad posting.',
    keywords: ['machinery', 'rental', 'construction', 'Kyrgyzstan', 'Bishkek', 'jobs', 'vacancies', 'services', 'building materials'],
    openGraph: {
        title: 'StroyMarket — Construction Marketplace of Kyrgyzstan',
        description: 'Machinery rental, services and job search in construction.',
        type: 'website',
        locale: 'en_US',
        siteName: 'StroyMarket',
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="ru">
            <body className={inter.className} suppressHydrationWarning>
                <AnimatedBackground />
                <Providers>
                    <div className="layout-wrapper">
                        <Header />
                        <main className="layout-main">
                            {children}
                        </main>
                        <Footer />
                        {/* <PopupAd /> */}
                    </div>
                </Providers>
            </body>
        </html>
    );
}
