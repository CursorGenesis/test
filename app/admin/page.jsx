"use client";

import { useState } from 'react';
import styles from './page.module.css';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Link from 'next/link';
import ChatModal from '../../components/ChatModal/ChatModal';
import {
    BiBarChart, BiListUl, BiTrash, BiEdit, BiCheck, BiX,
    BiUser, BiCategory, BiHeart, BiTrendingUp, BiShield, BiLinkExternal,
    BiSpeaker, BiMessageDetail, BiTime, BiCheckCircle, BiXCircle,
    BiLineChart, BiMouse, BiShow, BiGroup, BiImage, BiLock
} from 'react-icons/bi';

export default function AdminPage() {
    const {
        user, listings, getStats, deleteListing, updateListing, isLoaded,
        adRequests, updateAdRequest, deleteAdRequest, clearAllAdRequests, getMessages, getAnalytics,
        adminLogin
    } = useApp();
    const { t, lang } = useLanguage();

    const [activeTab, setActiveTab] = useState('dashboard');
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [deleteAdConfirm, setDeleteAdConfirm] = useState(null);
    const [clearAdsConfirm, setClearAdsConfirm] = useState(false);
    const [chatRequest, setChatRequest] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    // Login form state
    const [loginForm, setLoginForm] = useState({ username: '', password: '' });
    const [loginError, setLoginError] = useState('');

    const [loginLoading, setLoginLoading] = useState(false);

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setLoginLoading(true);
        setLoginError('');
        const result = await adminLogin(loginForm.username, loginForm.password);
        if (!result.success) {
            setLoginError(result.error);
        }
        setLoginLoading(false);
    };

    if (!isLoaded) {
        return <div className={styles.container}><p>{t('common.loading')}</p></div>;
    }

    // Check admin access - show login form
    if (!user?.isAdmin) {
        return (
            <div className={styles.container}>
                <div className={styles.loginCard}>
                    <div className={styles.loginHeader}>
                        <BiShield size={48} />
                        <h1>{lang === 'ru' ? 'Вход в админ-панель' : 'Админ-панелге кирүү'}</h1>
                        <p>{lang === 'ru' ? 'Введите логин и пароль' : 'Логин жана сырсөздү киргизиңиз'}</p>
                    </div>

                    <form onSubmit={handleAdminLogin} className={styles.loginForm}>
                        <div className={styles.formGroup}>
                            <label>
                                <BiUser size={18} />
                                {lang === 'ru' ? 'Логин' : 'Логин'}
                            </label>
                            <input
                                type="text"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                placeholder={lang === 'ru' ? 'Введите логин' : 'Логинди киргизиңиз'}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                <BiLock size={18} />
                                {lang === 'ru' ? 'Пароль' : 'Сырсөз'}
                            </label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                placeholder={lang === 'ru' ? 'Введите пароль' : 'Сырсөздү киргизиңиз'}
                                required
                            />
                        </div>

                        {loginError && (
                            <div className={styles.loginError}>
                                <BiXCircle size={18} />
                                {loginError}
                            </div>
                        )}

                        <button type="submit" className={styles.loginBtn} disabled={loginLoading}>
                            {loginLoading ? '...' : (lang === 'ru' ? 'Войти' : 'Кирүү')}
                        </button>
                    </form>

                    <Link href="/" className={styles.backToSite}>
                        ← {lang === 'ru' ? 'Вернуться на сайт' : 'Сайтка кайтуу'}
                    </Link>
                </div>
            </div>
        );
    }


    const stats = getStats();
    const analyticsData = getAnalytics();
    const maxDailyViews = Math.max(...analyticsData.dailyViews.map(d => d.count), 1);

    const startEdit = (listing) => {
        setEditingId(listing.id);
        setEditForm({
            title: listing.title,
            price: listing.price,
            location: listing.location,
            category: listing.category,
        });
    };

    const saveEdit = () => {
        updateListing(editingId, editForm);
        setEditingId(null);
        setEditForm({});
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const confirmDelete = (id) => {
        deleteListing(id);
        setDeleteConfirm(null);
    };

    return (
        <div className={styles.adminLayout}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                    <BiShield size={24} />
                    <span>{t('admin.title')}</span>
                </div>

                <nav className={styles.sidebarNav}>
                    <button
                        className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.active : ''}`}
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <BiBarChart size={20} /> {t('admin.dashboard')}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'listings' ? styles.active : ''}`}
                        onClick={() => setActiveTab('listings')}
                    >
                        <BiListUl size={20} /> {t('admin.listings')}
                    </button>
                    <button
                        className={`${styles.navItem} ${activeTab === 'ads' ? styles.active : ''}`}
                        onClick={() => setActiveTab('ads')}
                    >
                        <BiSpeaker size={20} />
                        {lang === 'ru' ? 'Заявки на рекламу' : 'Жарнама өтүнмөлөрү'}
                        {adRequests.filter(r => r.status === 'pending').length > 0 && (
                            <span className={styles.badge}>
                                {adRequests.filter(r => r.status === 'pending').length}
                            </span>
                        )}
                    </button>
                </nav>

                <div className={styles.sidebarFooter}>
                    <Link href="/" className={styles.backLink}>{t('admin.backToSite')}</Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className={styles.mainContent}>
                {activeTab === 'dashboard' && (
                    <div className={styles.dashboard}>
                        <h1 className={styles.pageTitle}>{t('admin.dashboard')}</h1>

                        {/* Analytics Stats */}
                        <div className={styles.analyticsGrid}>
                            <div className={styles.analyticCard}>
                                <div className={styles.analyticIcon} style={{ background: '#EEF2FF' }}>
                                    <BiShow size={24} color="#4F46E5" />
                                </div>
                                <div className={styles.analyticInfo}>
                                    <span className={styles.analyticValue}>{analyticsData.viewsToday}</span>
                                    <span className={styles.analyticLabel}>{lang === 'ru' ? 'Просмотров сегодня' : 'Бүгүнкү көрүүлөр'}</span>
                                </div>
                            </div>
                            <div className={styles.analyticCard}>
                                <div className={styles.analyticIcon} style={{ background: '#ECFDF5' }}>
                                    <BiLineChart size={24} color="#059669" />
                                </div>
                                <div className={styles.analyticInfo}>
                                    <span className={styles.analyticValue}>{analyticsData.viewsWeek}</span>
                                    <span className={styles.analyticLabel}>{lang === 'ru' ? 'За неделю' : 'Жума бою'}</span>
                                </div>
                            </div>
                            <div className={styles.analyticCard}>
                                <div className={styles.analyticIcon} style={{ background: '#FEF3C7' }}>
                                    <BiGroup size={24} color="#D97706" />
                                </div>
                                <div className={styles.analyticInfo}>
                                    <span className={styles.analyticValue}>{analyticsData.uniqueSessionsWeek}</span>
                                    <span className={styles.analyticLabel}>{lang === 'ru' ? 'Уникальных за неделю' : 'Жумалык уникалдуу'}</span>
                                </div>
                            </div>
                            <div className={styles.analyticCard}>
                                <div className={styles.analyticIcon} style={{ background: '#FEE2E2' }}>
                                    <BiMouse size={24} color="#DC2626" />
                                </div>
                                <div className={styles.analyticInfo}>
                                    <span className={styles.analyticValue}>{analyticsData.listingClicks}</span>
                                    <span className={styles.analyticLabel}>{lang === 'ru' ? 'Кликов по объявлениям' : 'Жарнамаларга чыкылдоо'}</span>
                                </div>
                            </div>
                            <div className={styles.analyticCard}>
                                <div className={styles.analyticIcon} style={{ background: '#DBEAFE' }}>
                                    <BiSpeaker size={24} color="#2563EB" />
                                </div>
                                <div className={styles.analyticInfo}>
                                    <span className={styles.analyticValue}>{analyticsData.adClicks}</span>
                                    <span className={styles.analyticLabel}>{lang === 'ru' ? 'Кликов по рекламе' : 'Жарнамага чыкылдоо'}</span>
                                </div>
                            </div>
                            <div className={styles.analyticCard}>
                                <div className={styles.analyticIcon} style={{ background: '#F3E8FF' }}>
                                    <BiTrendingUp size={24} color="#7C3AED" />
                                </div>
                                <div className={styles.analyticInfo}>
                                    <span className={styles.analyticValue}>{analyticsData.ctaClicks}</span>
                                    <span className={styles.analyticLabel}>{lang === 'ru' ? 'CTA кликов' : 'CTA чыкылдоо'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Daily Views Chart */}
                        <div className={styles.chartSection}>
                            <h2>{lang === 'ru' ? 'Просмотры за 7 дней' : '7 күндүк көрүүлөр'}</h2>
                            <div className={styles.dailyChart}>
                                {analyticsData.dailyViews.map((day, i) => (
                                    <div key={i} className={styles.chartBar}>
                                        <div className={styles.chartBarFill} style={{ height: `${(day.count / maxDailyViews) * 100}%` }}>
                                            <span className={styles.chartBarValue}>{day.count}</span>
                                        </div>
                                        <span className={styles.chartBarLabel}>{day.date}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Original Stats */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: '#DBEAFE' }}>
                                    <BiListUl size={24} color="#2563EB" />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statValue}>{stats.totalListings}</span>
                                    <span className={styles.statLabel}>{t('admin.totalListings')}</span>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: '#D1FAE5' }}>
                                    <BiUser size={24} color="#059669" />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statValue}>{stats.totalSellers}</span>
                                    <span className={styles.statLabel}>{t('admin.totalSellers')}</span>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: '#FEE2E2' }}>
                                    <BiHeart size={24} color="#DC2626" />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statValue}>{stats.totalFavorites}</span>
                                    <span className={styles.statLabel}>{t('admin.inFavorites')}</span>
                                </div>
                            </div>

                            <div className={styles.statCard}>
                                <div className={styles.statIcon} style={{ background: '#FEF3C7' }}>
                                    <BiCategory size={24} color="#D97706" />
                                </div>
                                <div className={styles.statInfo}>
                                    <span className={styles.statValue}>{Object.keys(stats.categoryCounts).length}</span>
                                    <span className={styles.statLabel}>{t('admin.categories')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Categories Chart */}
                        <div className={styles.chartSection}>
                            <h2>{t('admin.byCategories')}</h2>
                            <div className={styles.categoryBars}>
                                {Object.entries(stats.categoryCounts).map(([cat, count]) => (
                                    <div key={cat} className={styles.categoryBar}>
                                        <div className={styles.categoryLabel}>
                                            <span>{cat}</span>
                                            <span>{count}</span>
                                        </div>
                                        <div className={styles.barTrack}>
                                            <div
                                                className={styles.barFill}
                                                style={{ width: `${(count / stats.totalListings) * 100}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Top Pages */}
                        {analyticsData.topPages.length > 0 && (
                            <div className={styles.chartSection}>
                                <h2>{lang === 'ru' ? 'Популярные страницы' : 'Популярдуу баракчалар'}</h2>
                                <div className={styles.topPagesList}>
                                    {analyticsData.topPages.map(([page, count], i) => (
                                        <div key={page} className={styles.topPageItem}>
                                            <span className={styles.topPageRank}>#{i + 1}</span>
                                            <span className={styles.topPagePath}>{page}</span>
                                            <span className={styles.topPageCount}>{count}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'listings' && (
                    <div className={styles.listingsSection}>
                        <h1 className={styles.pageTitle}>{t('admin.manage')}</h1>

                        <div className={styles.tableWrapper}>
                            <table className={styles.table}>
                                <thead>
                                    <tr>
                                        <th>{t('common.id')}</th>
                                        <th>{lang === 'ru' ? 'Название' : 'Аталышы'}</th>
                                        <th>{t('common.price')}</th>
                                        <th>{t('common.category')}</th>
                                        <th>{t('common.location')}</th>
                                        <th>{t('common.actions')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listings.map(listing => (
                                        <tr key={listing.id}>
                                            <td className={styles.idCell}>#{listing.id.toString().slice(-4)}</td>

                                            {editingId === listing.id ? (
                                                <>
                                                    <td>
                                                        <input
                                                            value={editForm.title}
                                                            onChange={(e) => setEditForm(p => ({ ...p, title: e.target.value }))}
                                                            className={styles.editInput}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            value={editForm.price}
                                                            onChange={(e) => setEditForm(p => ({ ...p, price: e.target.value }))}
                                                            className={styles.editInput}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            value={editForm.category}
                                                            onChange={(e) => setEditForm(p => ({ ...p, category: e.target.value }))}
                                                            className={styles.editInput}
                                                        />
                                                    </td>
                                                    <td>
                                                        <input
                                                            value={editForm.location}
                                                            onChange={(e) => setEditForm(p => ({ ...p, location: e.target.value }))}
                                                            className={styles.editInput}
                                                        />
                                                    </td>
                                                    <td>
                                                        <div className={styles.actionBtns}>
                                                            <button onClick={saveEdit} className={styles.saveBtn}>
                                                                <BiCheck size={18} />
                                                            </button>
                                                            <button onClick={cancelEdit} className={styles.cancelBtn}>
                                                                <BiX size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className={styles.titleCell}>
                                                        <Link href={`/listing/${listing.id}`} className={styles.titleLink}>
                                                            {listing.title}
                                                            <BiLinkExternal size={14} />
                                                        </Link>
                                                    </td>
                                                    <td>{listing.price}</td>
                                                    <td>
                                                        <span className={styles.categoryTag}>{listing.category}</span>
                                                    </td>
                                                    <td>{listing.location}</td>
                                                    <td>
                                                        {deleteConfirm === listing.id ? (
                                                            <div className={styles.confirmDelete}>
                                                                <span>{t('admin.delete')}</span>
                                                                <button onClick={() => confirmDelete(listing.id)} className={styles.confirmYes}>{t('admin.yes')}</button>
                                                                <button onClick={() => setDeleteConfirm(null)} className={styles.confirmNo}>{t('admin.no')}</button>
                                                            </div>
                                                        ) : (
                                                            <div className={styles.actionBtns}>
                                                                <button onClick={() => startEdit(listing)} className={styles.editBtn}>
                                                                    <BiEdit size={18} />
                                                                </button>
                                                                <button onClick={() => setDeleteConfirm(listing.id)} className={styles.deleteBtn}>
                                                                    <BiTrash size={18} />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTab === 'ads' && (
                    <div className={styles.adsSection}>
                        <div className={styles.adsSectionHeader}>
                            <h1 className={styles.pageTitle}>
                                {lang === 'ru' ? 'Заявки на рекламу' : 'Жарнама өтүнмөлөрү'}
                            </h1>
                            {adRequests.length > 0 && (
                                clearAdsConfirm ? (
                                    <div className={styles.clearAdsConfirm}>
                                        <span>{lang === 'ru' ? 'Удалить все?' : 'Баарын өчүрөсүзбү?'}</span>
                                        <button
                                            onClick={() => { clearAllAdRequests(); setClearAdsConfirm(false); }}
                                            className={styles.confirmYes}
                                        >
                                            ✓
                                        </button>
                                        <button
                                            onClick={() => setClearAdsConfirm(false)}
                                            className={styles.confirmNo}
                                        >
                                            ✗
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={() => setClearAdsConfirm(true)}
                                        className={styles.clearAllBtn}
                                    >
                                        <BiTrash size={18} />
                                        {lang === 'ru' ? 'Очистить все' : 'Баарын тазалоо'}
                                    </button>
                                )
                            )}
                        </div>

                        {adRequests.length === 0 ? (
                            <div className={styles.emptyState}>
                                <BiSpeaker size={48} />
                                <p>{lang === 'ru' ? 'Нет заявок на рекламу' : 'Жарнама өтүнмөлөрү жок'}</p>
                            </div>
                        ) : (
                            <div className={styles.tableWrapper}>
                                <table className={styles.table}>
                                    <thead>
                                        <tr>
                                            <th>{lang === 'ru' ? 'Дата' : 'Күнү'}</th>
                                            <th>{lang === 'ru' ? 'Клиент' : 'Кардар'}</th>
                                            <th>{lang === 'ru' ? 'Тип баннера' : 'Баннер түрү'}</th>
                                            <th>{lang === 'ru' ? 'Срок' : 'Мөөнөт'}</th>
                                            <th>{lang === 'ru' ? 'Статус' : 'Статус'}</th>
                                            <th>{t('common.actions')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {adRequests.map(request => (
                                            <tr key={request.id}>
                                                <td className={styles.dateCell}>
                                                    {new Date(request.createdAt).toLocaleDateString('ru-RU')}
                                                </td>
                                                <td>
                                                    <div className={styles.clientInfo}>
                                                        <span className={styles.clientName}>{request.userName}</span>
                                                        <span className={styles.clientPhone}>{request.userPhone}</span>
                                                    </div>
                                                </td>
                                                <td>
                                                    <span className={styles.bannerType}>
                                                        {request.bannerType === 'top' && (lang === 'ru' ? 'Верхний' : 'Жогорку')}
                                                        {request.bannerType === 'left' && (lang === 'ru' ? 'Левый' : 'Сол')}
                                                        {request.bannerType === 'right' && (lang === 'ru' ? 'Правый' : 'Оң')}
                                                        {request.bannerType === 'popup' && 'Popup'}
                                                    </span>
                                                </td>
                                                <td>{request.duration} {lang === 'ru' ? 'мес.' : 'ай'}</td>
                                                <td>
                                                    <span className={`${styles.statusBadge} ${styles[request.status]}`}>
                                                        {request.status === 'pending' && (lang === 'ru' ? 'Ожидает' : 'Күтүүдө')}
                                                        {request.status === 'approved' && (lang === 'ru' ? 'Одобрено' : 'Жактырылды')}
                                                        {request.status === 'rejected' && (lang === 'ru' ? 'Отклонено' : 'Четке кагылды')}
                                                    </span>
                                                </td>
                                                <td>
                                                    <div className={styles.actionBtns}>
                                                        <button
                                                            onClick={() => setChatRequest(request)}
                                                            className={styles.chatBtn}
                                                            title={lang === 'ru' ? 'Чат' : 'Чат'}
                                                        >
                                                            <BiMessageDetail size={18} />
                                                            {getMessages(request.id).length > 0 && (
                                                                <span className={styles.msgCount}>
                                                                    {getMessages(request.id).length}
                                                                </span>
                                                            )}
                                                        </button>
                                                        {request.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => updateAdRequest(request.id, { status: 'approved' })}
                                                                    className={styles.approveBtn}
                                                                    title={lang === 'ru' ? 'Одобрить' : 'Жактыруу'}
                                                                >
                                                                    <BiCheckCircle size={18} />
                                                                </button>
                                                                <button
                                                                    onClick={() => updateAdRequest(request.id, { status: 'rejected' })}
                                                                    className={styles.rejectBtn}
                                                                    title={lang === 'ru' ? 'Отклонить' : 'Четке кагуу'}
                                                                >
                                                                    <BiXCircle size={18} />
                                                                </button>
                                                            </>
                                                        )}
                                                        {request.image && (
                                                            <button
                                                                onClick={() => setPreviewImage(request.image)}
                                                                className={styles.previewBtn}
                                                                title={lang === 'ru' ? 'Превью' : 'Көрүү'}
                                                            >
                                                                <BiImage size={18} />
                                                            </button>
                                                        )}
                                                        {deleteAdConfirm === request.id ? (
                                                            <div className={styles.inlineConfirm}>
                                                                <button
                                                                    onClick={() => { deleteAdRequest(request.id); setDeleteAdConfirm(null); }}
                                                                    className={styles.confirmYes}
                                                                >
                                                                    ✓
                                                                </button>
                                                                <button
                                                                    onClick={() => setDeleteAdConfirm(null)}
                                                                    className={styles.confirmNo}
                                                                >
                                                                    ✗
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button
                                                                onClick={() => setDeleteAdConfirm(request.id)}
                                                                className={styles.deleteAdBtn}
                                                                title={lang === 'ru' ? 'Удалить' : 'Өчүрүү'}
                                                            >
                                                                <BiTrash size={18} />
                                                            </button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Chat Modal */}
            {chatRequest && (
                <ChatModal
                    requestId={chatRequest.id}
                    requestName={chatRequest.userName}
                    isAdmin={true}
                    onClose={() => setChatRequest(null)}
                />
            )}

            {/* Image Preview Modal */}
            {previewImage && (
                <div className={styles.previewModal} onClick={() => setPreviewImage(null)}>
                    <div className={styles.previewContent} onClick={e => e.stopPropagation()}>
                        <button className={styles.previewClose} onClick={() => setPreviewImage(null)}>
                            <BiX size={24} />
                        </button>
                        <img src={previewImage} alt="Banner Preview" />
                    </div>
                </div>
            )}
        </div>
    );
}
