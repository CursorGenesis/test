"use client";

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import styles from './page.module.css';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import ListingCard from '../../components/ListingCard/ListingCard';
import Link from 'next/link';

function SearchResults() {
    const searchParams = useSearchParams();
    const query = searchParams.get('q') || '';
    const { searchListings, isLoaded } = useApp();
    const { t, lang } = useLanguage();

    if (!isLoaded) {
        return <p>{t('common.loading')}</p>;
    }

    const results = searchListings(query);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
                <h1 className={styles.title}>
                    {t('search.title')}: <span className={styles.query}>"{query}"</span>
                </h1>
                <p className={styles.count}>
                    {t('search.found')}: {results.length} {t('search.listings')}
                </p>
            </div>

            {results.length === 0 ? (
                <div className={styles.emptyState}>
                    <p>{t('search.noResults')}</p>
                    <p className={styles.hint}>
                        {t('search.hint')}
                    </p>
                    <Link href="/" className={styles.ctaLink}>
                        {t('search.seeAll')}
                    </Link>
                </div>
            ) : (
                <div className={styles.grid}>
                    {results.map(listing => (
                        <ListingCard key={listing.id} listing={listing} />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    const { t } = useLanguage();

    return (
        <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center' }}>{t('common.loading')}</div>}>
            <SearchResults />
        </Suspense>
    );
}
