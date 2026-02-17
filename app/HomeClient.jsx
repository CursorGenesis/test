"use client";

import { useEffect } from 'react';
import styles from './page.module.css';
import ListingCard from '../components/ListingCard/ListingCard';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { BiCheckCircle, BiShield, BiRocket, BiSupport } from 'react-icons/bi';

// ========== MASTER SWITCH FOR ALL ADS ==========
// Set to true to enable all advertising, false to disable
const ADS_ENABLED = false;
// ================================================

export default function HomeClient() {
    const { listings, isLoaded, adRequests, trackPageView, trackClick, startSession } = useApp();
    const { lang, t } = useLanguage();
    const router = useRouter();

    // Track page view and start session
    useEffect(() => {
        if (isLoaded) {
            startSession();
            trackPageView('/');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded]);

    const handleBuyBanner = () => {
        trackClick('cta', 'buy_banner_button');
        router.push('/advertise');
    };

    const handleAdClick = (adId, position) => {
        trackClick('ad', adId, { position });
    };

    // Helper to get active ad for a position
    const getActiveAd = (position) => {
        if (!isLoaded || !adRequests) return null;
        // Find the most recent approved ad for this position
        return adRequests
            .filter(req => req.status === 'approved' && req.bannerType === position)
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))[0];
    };

    // Cache active ads
    const topAd = getActiveAd('top');
    const leftAd = getActiveAd('left');
    const rightAd = getActiveAd('right');

    // Take first 4 listings for featured section
    const featuredListings = listings.slice(0, 4);



    const features = [
        { icon: <BiCheckCircle size={32} />, title: t('features.verified'), desc: t('features.verifiedDesc') },
        { icon: <BiShield size={32} />, title: t('features.trusted'), desc: t('features.trustedDesc') },
        { icon: <BiRocket size={32} />, title: t('features.quickStart'), desc: t('features.quickStartDesc') },
        { icon: <BiSupport size={32} />, title: t('features.support'), desc: t('features.supportDesc') },
    ];

    // Localized categories
    const localizedCategories = [
        {
            id: 1,
            slug: 'rent',
            icon: '🚜',
            title: t('categories.rent'),
            description: t('categories.rentDesc')
        },
        {
            id: 2,
            slug: 'materials',
            icon: '🏗️',
            title: t('categories.materials'),
            description: t('categories.materialsDesc')
        },
        {
            id: 3,
            slug: 'services',
            icon: '👷',
            title: t('categories.workers'),
            description: t('categories.workersDesc')
        },
        {
            id: 4,
            slug: 'tools',
            icon: '🛠️',
            title: t('categories.tools'),
            description: t('categories.toolsDesc')
        },
    ];

    return (
        <div className={styles.container}>
            {/* Top Banner Ad - between header and hero */}
            {ADS_ENABLED && (
                <div className={styles.topBannerWrapper}>
                    <div className={styles.topBanner}>
                        {topAd ? (
                            <a
                                href={topAd.website || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleAdClick(topAd.id, 'top')}
                                className={`${styles.activeAdFrame} ${styles.topActiveAd}`}
                            >
                                <img
                                    src={topAd.image}
                                    alt="Advertisement"
                                    className={styles.activeAdImage}
                                />
                            </a>
                        ) : (
                            <div className={styles.topBannerContent}>
                                <span className={styles.bannerLabel}>{t('ads.label')}</span>
                                <span className={styles.bannerText}>{t('ads.placeholderTop')}</span>
                                <button className={styles.buyBannerBtn} onClick={handleBuyBanner}>
                                    {t('ads.buyBanner')}
                                </button>
                                <span className={styles.bannerPhone}>+996 555 123 456</span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Main Layout with Side Banners */}
            <div className={styles.mainLayout} style={!ADS_ENABLED ? { gridTemplateColumns: '1fr', maxWidth: '1200px' } : undefined}>
                {/* Left Side Banner */}
                {/* Left Side Banner */}
                {ADS_ENABLED && (
                    <aside className={styles.sideBanner}>
                        {leftAd ? (
                            <a
                                href={leftAd.website || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleAdClick(leftAd.id, 'left')}
                                className={`${styles.activeAdFrame} ${styles.sideActiveAd}`}
                            >
                                <img
                                    src={leftAd.image}
                                    alt="Advertisement"
                                    className={styles.activeAdImage}
                                />
                            </a>
                        ) : (
                            <div className={styles.sideBannerContent}>
                                <div className={styles.sideBannerPlaceholder} onClick={handleBuyBanner} style={{ cursor: 'pointer' }}>
                                    <span>{t('ads.placeholderSide')}</span>
                                    <small>160x600</small>
                                </div>
                                <div className={styles.sideBannerInfo}>
                                    <span className={styles.bannerLabel}>{t('ads.label')}</span>
                                    <button className={styles.buyBannerBtn} onClick={handleBuyBanner}>
                                        {t('ads.buyBanner')}
                                    </button>
                                    <a href="tel:+996555123456" className={styles.bannerPhone}>+996 555 123 456</a>
                                </div>
                            </div>
                        )}
                    </aside>
                )}

                {/* Center Content */}
                <div className={styles.centerContent}>
                    {/* Hero Section */}
                    <header className={styles.hero}>
                        <div className={styles.heroBg}></div>
                        <div className={styles.heroContent}>
                            <h1 className={styles.title}>
                                {lang === 'ky' ? (
                                    <>
                                        <span className={styles.highlight}>{t('hero.title')}</span> <br />
                                        {t('hero.titleHighlight')}
                                    </>
                                ) : (
                                    <>
                                        {t('hero.title')} <br />
                                        <span className={styles.highlight}>{t('hero.titleHighlight')}</span>
                                    </>
                                )}
                            </h1>
                            <p className={styles.subtitle}>
                                {t('hero.subtitle')}
                            </p>

                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    placeholder={t('hero.searchPlaceholder')}
                                    className={styles.searchInput}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            router.push(`/search?q=${encodeURIComponent(e.target.value)}`);
                                        }
                                    }}
                                />
                                <button
                                    className={styles.searchButton}
                                    onClick={(e) => {
                                        const input = e.target.closest(`.${styles.searchBox}`)?.querySelector('input');
                                        if (input?.value.trim()) {
                                            router.push(`/search?q=${encodeURIComponent(input.value)}`);
                                        }
                                    }}
                                >
                                    {t('hero.searchButton')}
                                </button>
                            </div>

                            <div className={styles.heroActions}>
                                <Link href="/submit" className={styles.ctaButton}>{t('hero.submitListing')}</Link>
                                <Link href="/category/rent" className={styles.secondaryButton}>{t('hero.browseCategories')}</Link>
                            </div>
                        </div>
                    </header>



                    {/* Categories Section */}
                    <section className={styles.section}>
                        <h2 className={styles.sectionTitle}>{t('categories.title')}</h2>
                        <div className={styles.categoryGrid}>
                            {localizedCategories.map((cat) => (
                                <Link href={`/category/${cat.slug}`} key={cat.id} className={styles.categoryCard}>
                                    <div className={styles.categoryIcon}>{cat.icon}</div>
                                    <h3>{cat.title}</h3>
                                    <p>{cat.description}</p>
                                </Link>
                            ))}
                        </div>
                    </section>

                    {/* Ad Banner 1 */}
                    {ADS_ENABLED && (
                        <section className={styles.adBanner}>
                            <div className={styles.adContent}>
                                <span className={styles.adLabel}>{t('ads.label')}</span>
                                <h3>{t('ads.rentTitle')}</h3>
                                <p>{t('ads.rentDesc')}</p>
                            </div>
                        </section>
                    )}

                    {/* Featured Listings Section */}
                    <section className={styles.section}>
                        <div className={styles.sectionHeader}>
                            <h2 className={styles.sectionTitle}>{t('listings.fresh')}</h2>
                            <Link href="/category/rent" className={styles.seeAllLink}>
                                {t('listings.seeAll')}
                            </Link>
                        </div>

                        <div className={styles.listingsGrid}>
                            {isLoaded && featuredListings.map((listing) => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    </section>

                    {/* Ad Banner 2 - Side by side */}
                    {ADS_ENABLED && (
                        <section className={styles.adBannerRow}>
                            <div className={styles.adBannerSmall}>
                                <div className={styles.adContentSmall}>
                                    <span className={styles.adLabel}>{t('ads.label')}</span>
                                    <h4>{t('ads.salesTitle')}</h4>
                                    <button className={styles.buyBannerBtn} onClick={handleBuyBanner} style={{ marginTop: '0.5rem' }}>
                                        {t('ads.buyBanner')}
                                    </button>
                                    <p>+996 700 111 222</p>
                                </div>
                            </div>
                            <div className={styles.adBannerSmall}>
                                <div className={styles.adContentSmall}>
                                    <span className={styles.adLabel}>{t('ads.label')}</span>
                                    <h4>{t('ads.workersTitle')}</h4>
                                    <button className={styles.buyBannerBtn} onClick={handleBuyBanner} style={{ marginTop: '0.5rem' }}>
                                        {t('ads.buyBanner')}
                                    </button>
                                    <p>+996 700 333 444</p>
                                </div>
                            </div>
                        </section>
                    )}

                    {/* Features Section */}
                    <section className={styles.featuresSection}>
                        <h2 className={styles.sectionTitle}>{t('features.title')}</h2>
                        <div className={styles.featuresGrid}>
                            {features.map((feature, index) => (
                                <div key={index} className={styles.featureCard}>
                                    <div className={styles.featureIcon}>{feature.icon}</div>
                                    <h3>{feature.title}</h3>
                                    <p>{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className={styles.ctaSection}>
                        <h2>{t('cta.title')}</h2>
                        <p>{t('cta.subtitle')}</p>
                        <Link href="/submit" className={styles.ctaButtonLarge}>{t('cta.button')}</Link>
                    </section>
                </div>
                {/* End Center Content */}

                {/* Right Side Banner */}
                {ADS_ENABLED && (
                    <aside className={styles.sideBanner}>
                        {rightAd ? (
                            <a
                                href={rightAd.website || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => handleAdClick(rightAd.id, 'right')}
                                className={`${styles.activeAdFrame} ${styles.sideActiveAd}`}
                            >
                                <img
                                    src={rightAd.image}
                                    alt="Advertisement"
                                    className={styles.activeAdImage}
                                />
                            </a>
                        ) : (
                            <div className={styles.sideBannerContent}>
                                <div className={styles.sideBannerPlaceholder} onClick={handleBuyBanner} style={{ cursor: 'pointer' }}>
                                    <span>{t('ads.placeholderSide')}</span>
                                    <small>160x600</small>
                                </div>
                                <div className={styles.sideBannerInfo}>
                                    <span className={styles.bannerLabel}>{t('ads.label')}</span>
                                    <button className={styles.buyBannerBtn} onClick={handleBuyBanner}>
                                        {t('ads.buyBanner')}
                                    </button>
                                    <a href="tel:+996555123456" className={styles.bannerPhone}>+996 555 123 456</a>
                                </div>
                            </div>
                        )}
                    </aside>
                )}
            </div>
            {/* End Main Layout */}
        </div>
    );
}
