"use client";

import { useState } from 'react';
import styles from './page.module.css';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import ListingCard from '../../components/ListingCard/ListingCard';
import ChatModal from '../../components/ChatModal/ChatModal';
import SocialAuth from '../../components/SocialAuth/SocialAuth';
import { BiUser, BiLogOut, BiHeart, BiListUl, BiSpeaker, BiMessageDetail, BiPencil, BiTrash, BiCog } from 'react-icons/bi';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfilePage() {
    const { user, login, logout, getUserListings, getFavoriteListings, getUserAdRequests, getMessages, isLoaded, deleteListing } = useApp();
    const { t, lang } = useLanguage();
    const [activeTab, setActiveTab] = useState('listings');
    const [loginForm, setLoginForm] = useState({ name: '', phone: '' });
    const [chatRequest, setChatRequest] = useState(null);

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginForm.name.trim() && loginForm.phone.trim()) {
            login(loginForm.name, loginForm.phone);
        }
    };

    if (!isLoaded) {
        return <div className={styles.container}><p>{t('common.loading')}</p></div>;
    }

    // Not logged in - show login form
    if (!user) {
        return (
            <div className={styles.container}>
                <div className={styles.loginCard}>
                    <h1 className={styles.loginTitle}>{t('profile.loginTitle')}</h1>
                    <p className={styles.loginSubtitle}>
                        {t('profile.loginSubtitle')}
                    </p>

                    <form onSubmit={handleLogin} className={styles.loginForm}>
                        <div className={styles.formGroup}>
                            <label>{t('profile.nameLabel')}</label>
                            <input
                                type="text"
                                placeholder={t('profile.namePlaceholder')}
                                value={loginForm.name}
                                onChange={(e) => setLoginForm(p => ({ ...p, name: e.target.value }))}
                                required
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>{t('profile.phoneLabel')}</label>
                            <input
                                type="tel"
                                placeholder={t('profile.phonePlaceholder')}
                                value={loginForm.phone}
                                onChange={(e) => setLoginForm(p => ({ ...p, phone: e.target.value }))}
                                required
                            />
                        </div>
                        <button type="submit" className={styles.loginButton}>{t('profile.loginButton')}</button>
                    </form>

                    <SocialAuth />
                </div>
            </div>
        );
    }

    // Logged in - show profile
    const userListings = getUserListings();
    const favoriteListings = getFavoriteListings();
    const userAdRequests = getUserAdRequests();

    return (
        <div className={styles.container}>
            <div className={styles.profileHeader}>
                <div className={styles.avatar}>
                    {user.avatar ? (
                        <Image
                            src={user.avatar}
                            alt={user.name}
                            fill
                            style={{ objectFit: 'cover', borderRadius: '50%' }}
                        />
                    ) : (
                        <BiUser size={32} />
                    )}
                </div>
                <div className={styles.userInfo}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h1>{user.name}</h1>
                        <Link href="/profile/settings" style={{ color: '#F59E0B' }}>
                            <BiCog size={20} />
                        </Link>
                    </div>
                    <p>{user.phone}</p>
                </div>
                <button onClick={logout} className={styles.logoutButton}>
                    <BiLogOut size={20} /> {t('profile.logout')}
                </button>
            </div>

            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'listings' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('listings')}
                >
                    <BiListUl size={20} /> {t('profile.myListings')} ({userListings.length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'favorites' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('favorites')}
                >
                    <BiHeart size={20} /> {t('profile.favorites')} ({favoriteListings.length})
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'ads' ? styles.activeTab : ''}`}
                    onClick={() => setActiveTab('ads')}
                >
                    <BiSpeaker size={20} /> {t('profile.myRequests')} ({userAdRequests.length})
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'listings' && (
                    <>
                        {userListings.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>{t('profile.noListings')}</p>
                                <Link href="/submit" className={styles.ctaLink}>
                                    {t('header.postAd')}
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {userListings.map(l => (
                                    <div key={l.id} className={styles.manageCardWrapper}>
                                        <ListingCard listing={l} />
                                        <div className={styles.cardActions}>
                                            <Link href={`/edit/${l.id}`} className={styles.editActionBtn}>
                                                <BiPencil /> {t('profile.edit')}
                                            </Link>
                                            <button
                                                className={styles.deleteActionBtn}
                                                onClick={() => {
                                                    if (confirm(t('profile.deleteConfirm'))) {
                                                        deleteListing(l.id);
                                                    }
                                                }}
                                            >
                                                <BiTrash /> {t('profile.delete')}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'favorites' && (
                    <>
                        {favoriteListings.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>{t('profile.noFavorites')}</p>
                                <Link href="/" className={styles.ctaLink}>
                                    {t('profile.viewListings')}
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.grid}>
                                {favoriteListings.map(l => <ListingCard key={l.id} listing={l} />)}
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'ads' && (
                    <>
                        {userAdRequests.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>{t('profile.noRequests')}</p>
                                <Link href="/advertise" className={styles.ctaLink}>
                                    {t('profile.apply')}
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.adRequestsList}>
                                {userAdRequests.map(request => (
                                    <div key={request.id} className={styles.adRequestCard}>
                                        <div className={styles.adRequestHeader}>
                                            <span className={styles.adRequestDate}>
                                                {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                                            </span>
                                            <span className={`${styles.adStatus} ${styles[request.status]}`}>
                                                {request.status === 'pending' && t('profile.pending')}
                                                {request.status === 'approved' && t('profile.approved')}
                                                {request.status === 'rejected' && t('profile.rejected')}
                                            </span>
                                        </div>
                                        <div className={styles.adRequestBody}>
                                            <p className={styles.adRequestType}>
                                                {t('profile.type')}
                                                {request.bannerType === 'top' && ` ${t('profile.topBanner')}`}
                                                {request.bannerType === 'left' && ` ${t('profile.leftBanner')}`}
                                                {request.bannerType === 'right' && ` ${t('profile.rightBanner')}`}
                                                {request.bannerType === 'popup' && ` ${t('profile.popup')}`}
                                            </p>
                                            <p className={styles.adRequestDuration}>
                                                {t('profile.duration')} {request.duration} {t('profile.months')}
                                            </p>
                                        </div>
                                        <button
                                            className={styles.chatBtn}
                                            onClick={() => setChatRequest(request)}
                                        >
                                            <BiMessageDetail size={18} />
                                            {t('profile.chatAdmin')}
                                            {getMessages(request.id).length > 0 && (
                                                <span className={styles.msgBadge}>
                                                    {getMessages(request.id).length}
                                                </span>
                                            )}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Chat Modal */}
            {chatRequest && (
                <ChatModal
                    requestId={chatRequest.id}
                    requestName={`${t('profile.request')} #${chatRequest.id.toString().slice(-4)}`}
                    isAdmin={false}
                    onClose={() => setChatRequest(null)}
                />
            )}
        </div>
    );
}
