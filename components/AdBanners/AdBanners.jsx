"use client";

import { useState, useEffect, memo } from 'react';
import { useRouter } from 'next/navigation';
import styles from './AdBanners.module.css';
import { BiX } from 'react-icons/bi';
import { useLanguage } from '../../context/LanguageContext';

export const SidebarAds = memo(function SidebarAds() {
    const { lang, t } = useLanguage();
    const router = useRouter();

    const handleBuyBanner = () => {
        router.push('/advertise');
    };

    return (
        <>
            {/* Left Sidebar Ad */}
            <div className={styles.sidebarAd + ' ' + styles.left}>
                <div className={styles.sidebarImagePlaceholder} onClick={handleBuyBanner}>
                    <span>{t('banners.yourAd')}</span>
                    <span className={styles.sidebarSize}>160×600</span>
                </div>
                <div className={styles.sidebarInfo}>
                    <span className={styles.adLabel}>{t('banners.adLabel')}</span>
                    <button className={styles.buyBannerBtn} onClick={handleBuyBanner}>
                        {t('banners.buyBanner')}
                    </button>
                    <a href="tel:+996555123456" className={styles.sidebarPhone}>+996 555 123 456</a>
                </div>
            </div>

            {/* Right Sidebar Ad */}
            <div className={styles.sidebarAd + ' ' + styles.right}>
                <div className={styles.sidebarImagePlaceholder} onClick={handleBuyBanner}>
                    <span>{t('banners.yourAd')}</span>
                    <span className={styles.sidebarSize}>160×600</span>
                </div>
                <div className={styles.sidebarInfo}>
                    <span className={styles.adLabel}>{t('banners.adLabel')}</span>
                    <button className={styles.buyBannerBtn} onClick={handleBuyBanner}>
                        {t('banners.buyBanner')}
                    </button>
                    <a href="tel:+996555123456" className={styles.sidebarPhone}>+996 555 123 456</a>
                </div>
            </div>
        </>
    );
});

export const PopupAd = memo(function PopupAd() {
    const { lang, t } = useLanguage();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if popup was already shown
        if (typeof window !== 'undefined') {
            const wasShown = sessionStorage.getItem('popupAdShown');
            if (!wasShown) {
                const timer = setTimeout(() => {
                    setIsVisible(true);
                    sessionStorage.setItem('popupAdShown', 'true');
                }, 3000);
                return () => clearTimeout(timer);
            }
        }
    }, []);

    const handleClose = () => {
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className={styles.popupOverlay} onClick={handleClose}>
            <div className={styles.popupContent} onClick={e => e.stopPropagation()}>
                <button className={styles.popupClose} onClick={handleClose}>
                    <BiX size={24} />
                </button>

                <div className={styles.popupBadge}>🔥 {t('banners.promo')}</div>

                <h3>
                    {t('banners.discount')}
                </h3>

                <p>
                    {t('banners.bonus')}
                </p>

                <a href="/submit" className={styles.popupButton}>
                    {t('banners.postFree')}
                </a>

                <button className={styles.popupDismiss} onClick={handleClose}>
                    {t('banners.notNow')}
                </button>
            </div>
        </div>
    );
});
