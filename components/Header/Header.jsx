"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import styles from './Header.module.css';
import {
    BiUser, BiMenu, BiSearch, BiX, BiPlus, BiGlobe,
    BiPhone, BiMap, BiHeart, BiTime, BiEnvelope
} from 'react-icons/bi';
import { FaTelegramPlane, FaWhatsapp } from 'react-icons/fa';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';

export default function Header() {
    const router = useRouter();
    const { user, favorites, directMessages, currency, changeCurrency } = useApp();
    const { lang, switchLanguage, t } = useLanguage();
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [langMenuOpen, setLangMenuOpen] = useState(false);

    // Calculate unread user-to-user messages
    const unreadMessagesCount = user
        ? directMessages?.filter(m => !m.read && m.senderId !== user.phone).length
        : 0;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
    };

    const handleLangSwitch = (newLang) => {
        switchLanguage(newLang);
        setLangMenuOpen(false);
    };

    const categories = [
        { slug: 'rent', label: t('categories.rent'), icon: '🚜' },
        { slug: 'materials', label: t('categories.materials'), icon: '🏗️' },
        { slug: 'services', label: t('categories.workers'), icon: '👷' },
        { slug: 'tools', label: t('categories.tools'), icon: '🛠️' },
    ];

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(prev => !prev);
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            {/* Top Bar - Hidden on mobile */}
            <div className={styles.topBar}>
                <div className={styles.topBarContent}>
                    <div className={styles.topBarLeft}>
                        <a href="tel:+996555123456" className={styles.topBarLink}>
                            <BiPhone size={14} />
                            <span>+996 555 123 456</span>
                        </a>
                        <span className={styles.topBarDivider}>|</span>
                        <div className={styles.topBarLink}>
                            <BiTime size={14} />
                            <span>{t('header.workingHours')}</span>
                        </div>
                        <span className={styles.topBarDivider}>|</span>
                        <div className={styles.topBarLink}>
                            <BiMap size={14} />
                            <span>{t('header.city')}</span>
                        </div>
                    </div>
                    <div className={styles.topBarRight}>
                        <a href="https://t.me/stroymarket" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                            <FaTelegramPlane size={14} />
                        </a>
                        <a href="https://wa.me/996555123456" className={styles.socialIcon} target="_blank" rel="noopener noreferrer">
                            <FaWhatsapp size={14} />
                        </a>
                        <span className={styles.topBarDivider}>|</span>
                        <div className={styles.langSwitcherCompact} style={{ marginRight: '10px' }}>
                            <button
                                className={`${styles.langBtn} ${currency === 'KGS' ? styles.activeLang : ''}`}
                                onClick={() => changeCurrency('KGS')}
                            >
                                KGS
                            </button>
                            <button
                                className={`${styles.langBtn} ${currency === 'USD' ? styles.activeLang : ''}`}
                                onClick={() => changeCurrency('USD')}
                            >
                                USD
                            </button>
                        </div>
                        <span className={styles.topBarDivider}>|</span>
                        <div className={styles.langSwitcherCompact}>
                            <button
                                className={`${styles.langBtn} ${lang === 'ru' ? styles.activeLang : ''}`}
                                onClick={() => handleLangSwitch('ru')}
                            >
                                RU
                            </button>
                            <button
                                className={`${styles.langBtn} ${lang === 'ky' ? styles.activeLang : ''}`}
                                onClick={() => handleLangSwitch('ky')}
                            >
                                KY
                            </button>
                            <button
                                className={`${styles.langBtn} ${lang === 'en' ? styles.activeLang : ''}`}
                                onClick={() => handleLangSwitch('en')}
                            >
                                EN
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Header */}
            <div className={styles.mainHeader}>
                <div className={styles.container}>
                    <Link href="/" className={styles.logo}>
                        Stroy<span className={styles.logoAccent}>Market</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className={styles.categoryNav}>
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/category/${cat.slug}`}
                                className={styles.categoryButton}
                            >
                                <span className={styles.categoryIcon}>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Search */}
                    <form onSubmit={handleSearch} className={styles.searchBox}>
                        <input
                            type="text"
                            placeholder={t('header.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.searchInputMain}
                        />
                        <button type="submit" className={styles.searchBtn} aria-label={t('header.search')}>
                            <BiSearch size={20} />
                        </button>
                    </form>

                    <div className={styles.actions}>
                        <Link href="/messages" className={styles.iconLink}>
                            <BiEnvelope size={22} />
                            {unreadMessagesCount > 0 && (
                                <span className={styles.badge}>{unreadMessagesCount}</span>
                            )}
                        </Link>

                        <Link href="/profile" className={styles.iconLink}>
                            <BiHeart size={22} />
                            {favorites?.length > 0 && (
                                <span className={styles.badge}>{favorites.length}</span>
                            )}
                        </Link>

                        <Link href="/submit" className={styles.submitButton}>
                            <BiPlus size={20} />
                            <span>{t('header.submit')}</span>
                        </Link>

                        <Link href="/profile" className={styles.authButton}>
                            {user?.avatar ? (
                                <div style={{ position: 'relative', width: 24, height: 24, borderRadius: '50%', overflow: 'hidden', border: '1px solid #F59E0B' }}>
                                    <Image src={user.avatar} alt="User" fill style={{ objectFit: 'cover' }} />
                                </div>
                            ) : (
                                <BiUser size={20} />
                            )}
                            <span>{user ? user.name.split(' ')[0] : t('header.login')}</span>
                        </Link>

                        <button className={styles.menuButton} onClick={toggleMobileMenu} aria-label={t('header.openMenu')}>
                            <BiMenu size={24} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`${styles.mobileMenuOverlay} ${mobileMenuOpen ? styles.open : ''}`}>
                <div className={styles.mobileMenuHeader}>
                    <Link href="/" className={styles.logo} onClick={closeMobileMenu}>
                        Stroy<span className={styles.logoAccent}>Market</span>
                    </Link>
                    <button className={styles.closeMenuBtn} onClick={toggleMobileMenu} aria-label={t('header.closeMenu')}>
                        <BiX size={32} />
                    </button>
                </div>

                <div className={styles.mobileMenuContent}>
                    {/* Mobile Search */}
                    <form onSubmit={(e) => { handleSearch(e); closeMobileMenu(); }} className={styles.mobileSearchBox}>
                        <input
                            type="text"
                            placeholder={t('header.searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className={styles.mobileSearchInput}
                        />
                        <button type="submit" className={styles.mobileSearchBtn}>
                            <BiSearch size={20} />
                        </button>
                    </form>

                    {/* Mobile Navigation */}
                    <nav className={styles.mobileNav}>
                        {categories.map((cat) => (
                            <Link
                                key={cat.slug}
                                href={`/category/${cat.slug}`}
                                className={styles.mobileNavLink}
                                onClick={closeMobileMenu}
                            >
                                <span className={styles.categoryIcon}>{cat.icon}</span>
                                <span>{cat.label}</span>
                            </Link>
                        ))}
                    </nav>

                    <div className={styles.mobileActions}>
                        <Link href="/submit" className={styles.mobileActionBtn} onClick={closeMobileMenu}>
                            <BiPlus size={20} />
                            <span>{t('header.postAd')}</span>
                        </Link>
                        <Link href="/messages" className={styles.mobileActionBtn} onClick={closeMobileMenu}>
                            <BiEnvelope size={20} />
                            <span>{t('header.messages')} ({unreadMessagesCount})</span>
                        </Link>
                        <Link href="/profile" className={styles.mobileActionBtn} onClick={closeMobileMenu}>
                            <BiUser size={20} />
                            <span>{user ? t('header.myCabinet') : t('header.login')}</span>
                        </Link>
                        <Link href="/profile" className={styles.mobileActionBtn} onClick={closeMobileMenu}>
                            <BiHeart size={20} />
                            <span>{t('header.favorites')} ({favorites?.length || 0})</span>
                        </Link>
                    </div>

                    <div className={styles.mobileFooter}>
                        <div className={styles.mobileLangSwitcher}>
                            <button
                                className={`${styles.mobileLangBtn} ${lang === 'ru' ? styles.active : ''}`}
                                onClick={() => handleLangSwitch('ru')}
                            >
                                Русский
                            </button>
                            <button
                                className={`${styles.mobileLangBtn} ${lang === 'ky' ? styles.active : ''}`}
                                onClick={() => handleLangSwitch('ky')}
                            >
                                Кыргызча
                            </button>
                            <button
                                className={`${styles.mobileLangBtn} ${lang === 'en' ? styles.active : ''}`}
                                onClick={() => handleLangSwitch('en')}
                            >
                                English
                            </button>
                        </div>
                        <div className={styles.mobileSocials}>
                            <a href="https://t.me/stroymarket" target="_blank" rel="noopener noreferrer">
                                <FaTelegramPlane size={24} />
                            </a>
                            <a href="https://wa.me/996555123456" target="_blank" rel="noopener noreferrer">
                                <FaWhatsapp size={24} />
                            </a>
                        </div>
                    </div>
                    <div className={styles.mobileLangSwitcher} style={{ marginTop: '10px' }}>
                        <button
                            className={`${styles.mobileLangBtn} ${currency === 'KGS' ? styles.active : ''}`}
                            onClick={() => changeCurrency('KGS')}
                        >
                            Som (KGS)
                        </button>
                        <button
                            className={`${styles.mobileLangBtn} ${currency === 'USD' ? styles.active : ''}`}
                            onClick={() => changeCurrency('USD')}
                        >
                            USD ($)
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}
