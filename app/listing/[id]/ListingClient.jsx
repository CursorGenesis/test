"use client";

import { useState, useEffect, useRef } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import Link from 'next/link';
import { BiMap, BiCategory, BiPhone, BiStar, BiShareAlt, BiHeart, BiSolidHeart, BiPencil, BiTrash, BiShow } from 'react-icons/bi';
import { useApp } from '../../../context/AppContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useRouter } from 'next/navigation';
import ListingCard from '../../../components/ListingCard/ListingCard';

import { useToast } from '../../../context/ToastContext';

export default function ListingClient({ id }) {
    const { getListingById, isFavorite, toggleFavorite, isLoaded, user, startConversation, deleteListing, getSimilarListings, incrementListingView, formatPrice } = useApp();
    const { t, lang } = useLanguage();
    const { showSuccess, showInfo, showError } = useToast();
    const router = useRouter();
    const viewIncremented = useRef(false);

    useEffect(() => {
        if (isLoaded && id && !viewIncremented.current) {
            incrementListingView(id);
            viewIncremented.current = true;
        }
    }, [isLoaded, id, incrementListingView]);

    if (!isLoaded) {
        return (
            <div className={styles.container}>
                <p>{t('common.loading')}</p>
            </div>
        );
    }

    const listing = getListingById(id);

    if (!listing) {
        return (
            <div className={styles.container}>
                <h1>{t('listing.notFound')}</h1>
                <Link href="/">{t('listing.backToHome')}</Link>
            </div>
        );
    }

    const isInFavorites = isFavorite(listing.id);

    // ...

    const handleToggleFavorite = (id) => {
        const wasFavorite = isFavorite(id);
        toggleFavorite(id);
        if (wasFavorite) {
            showInfo(t('listing.removedFromFavorites'));
        } else {
            showSuccess(t('listing.addedToFavorites'));
        }
    };

    const handleMessage = () => {
        if (!user) {
            showError(t('listing.loginToMessage'));
            router.push('/profile');
            return;
        }

        if (listing.seller?.phone === user.phone) {
            showError(t('listing.selfMessageError'));
            return;
        }

        const conversation = startConversation(listing.seller, listing);
        if (conversation) {
            router.push(`/messages?id=${conversation.id}`);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.crumbs}>
                <Link href="/">{t('listing.home')}</Link> / <span>{listing.category}</span> / <span>{listing.title}</span>
            </div>

            <div className={styles.contentWrapper}>
                <div className={styles.mainContent}>
                    <div className={styles.imageGallery}>
                        <div className={styles.mainImage}>
                            <Image
                                src={listing.image}
                                alt={listing.title}
                                fill
                                className={styles.img}
                                priority
                            />
                        </div>
                    </div>

                    <div className={styles.section}>
                        <h2 className={styles.sectionTitle}>
                            {t('listing.description')}
                        </h2>
                        <p className={styles.descriptionText}>
                            {listing.description || t('listing.noDescription')}
                        </p>
                    </div>

                    {listing.specs && listing.specs.length > 0 && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>
                                {t('listing.specs')}
                            </h2>
                            <div className={styles.specsGrid}>
                                {listing.specs.map((spec, index) => {
                                    const labelKey = `fields.${spec.name}`;
                                    const label = t(labelKey);
                                    const displayLabel = label === labelKey ? spec.name : label;

                                    const valueKey = `options.${spec.value}`;
                                    const valTrans = t(valueKey);
                                    const displayValue = valTrans === valueKey ? spec.value : valTrans;

                                    return (
                                        <div key={index} className={styles.specItem}>
                                            <span className={styles.specName}>{displayLabel}</span>
                                            <span className={styles.specValue}>{displayValue}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>



                <aside className={styles.sidebar}>
                    <div className={styles.priceCard}>
                        <h1 className={styles.title}>{listing.title}</h1>
                        <div className={styles.price}>{formatPrice(listing.price)}</div>

                        <div className={styles.meta}>
                            <div className={styles.metaRow}>
                                <BiMap /> {listing.location}
                            </div>
                            <div className={styles.metaRow}>
                                <BiCategory /> {listing.category}
                            </div>
                            <div className={styles.metaRow} style={{ gap: '1.5rem' }}>
                                <span title={t('listing.views')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BiShow size={20} /> {listing.views || 0}
                                </span>
                                <span title={t('listing.inFavorites')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BiHeart size={18} /> {listing.favorites || 0}
                                </span>
                            </div>
                        </div>

                        <button className={styles.callButton}>
                            <BiPhone size={20} />
                            {listing.seller?.phone || t('listing.showPhone')}
                        </button>

                        <button className={styles.messageButton} onClick={handleMessage}>
                            {t('listing.message')}
                        </button>

                        <div className={styles.actions}>
                            <button
                                className={`${styles.actionBtn} ${isInFavorites ? styles.favoriteActive : ''}`}
                                onClick={() => handleToggleFavorite(listing.id)}
                            >
                                {isInFavorites ? <BiSolidHeart /> : <BiHeart />}
                                {isInFavorites ? t('listing.removeFromFavorites') : t('listing.addToFavorites')}
                            </button>
                            <button className={styles.actionBtn}>
                                <BiShareAlt /> {t('listing.share')}
                            </button>
                        </div>

                        {user && listing.seller?.phone === user.phone && (
                            <div className={styles.ownerActions}>
                                <button className={styles.editBtn} onClick={() => router.push(`/edit/${listing.id}`)}>
                                    <BiPencil /> {t('listing.edit')}
                                </button>
                                <button
                                    className={styles.deleteBtn}
                                    onClick={() => {
                                        if (confirm(t('listing.deleteConfirm'))) {
                                            deleteListing(listing.id);
                                            router.push('/profile');
                                        }
                                    }}
                                >
                                    <BiTrash /> {t('listing.delete')}
                                </button>
                            </div>
                        )}
                    </div>

                    {listing.seller && (
                        <div className={styles.sellerCard}>
                            <div className={styles.sellerInfo}>
                                <div className={styles.avatar}>
                                    {listing.seller.name.charAt(0)}
                                </div>
                                <div>
                                    <div className={styles.sellerName}>{listing.seller.name}</div>
                                    <div className={styles.rating}>
                                        <BiStar className={styles.starIcon} />
                                        {listing.seller.rating} <span>({listing.seller.reviews} {t('listing.reviews')})</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </aside>
            </div>

            {/* Similar Listings */}
            {(() => {
                const similar = getSimilarListings(listing);
                return similar.length > 0 ? (
                    <div className={styles.similarSection}>
                        <h2 className={styles.sectionTitle}>
                            {t('listing.similar')}
                        </h2>
                        <div className={styles.similarGrid}>
                            {similar.map(item => (
                                <ListingCard key={item.id} listing={item} />
                            ))}
                        </div>
                    </div>
                ) : null;
            })()}
        </div>
    );
}
