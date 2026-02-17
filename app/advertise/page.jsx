"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import {
    BiImage, BiPhone, BiUser, BiCalendar, BiMessageDetail,
    BiCheckCircle, BiRocket
} from 'react-icons/bi';



export default function AdvertisePage() {
    const { user, addAdRequest } = useApp();
    const { t } = useLanguage();
    const router = useRouter();

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        email: '',
        website: '',
        bannerType: 'top',
        duration: '1',
        comment: '',
        image: null,
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setForm(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        addAdRequest({
            name: form.name,
            phone: form.phone,
            email: form.email,
            website: form.website,
            bannerType: form.bannerType,
            duration: form.duration,
            comment: form.comment,
            image: form.image,
        });

        setIsLoading(false);
        setIsSubmitted(true);
    };

    const BANNER_TYPES = [
        { id: 'top', label: 'advertise.top', size: '728×90', price: '5000 сом/мес' },
        { id: 'left', label: 'advertise.left', size: '160×600', price: '4000 сом/мес' },
        { id: 'right', label: 'advertise.right', size: '160×600', price: '4000 сом/мес' },
        { id: 'popup', label: 'advertise.popup', size: '400×300', price: '7000 сом/мес' },
    ];

    if (isSubmitted) {
        return (
            <div className={styles.container}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}>
                        <BiCheckCircle size={64} />
                    </div>
                    <h1>{t('advertise.successTitle')}</h1>
                    <p>
                        {t('advertise.successMessage')}
                    </p>
                    <div className={styles.successActions}>
                        <button onClick={() => router.push('/')} className={styles.homeBtn}>
                            {t('advertise.toHome')}
                        </button>
                        <button onClick={() => router.push('/profile')} className={styles.profileBtn}>
                            {t('advertise.myRequests')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <BiRocket size={40} className={styles.headerIcon} />
                <h1>{t('advertise.headerTitle')}</h1>
                <p>
                    {t('advertise.headerDesc')}
                </p>
            </div>

            <div className={styles.content}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    {/* Contact Info */}
                    <div className={styles.section}>
                        <h2>{t('advertise.contactInfo')}</h2>

                        <div className={styles.inputGroup}>
                            <label>
                                <BiUser size={18} />
                                {t('advertise.nameCompany')}
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder={t('advertise.namePlaceholder')}
                                required
                            />
                        </div>

                        <div className={styles.row}>
                            <div className={styles.inputGroup}>
                                <label>
                                    <BiPhone size={18} />
                                    {t('advertise.phone')}
                                </label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    placeholder="+996 XXX XXX XXX"
                                    required
                                />
                            </div>

                            <div className={styles.inputGroup}>
                                <label>Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    placeholder="email@example.com"
                                />
                            </div>
                        </div>

                        <div className={styles.inputGroup}>
                            <label>
                                🔗 {t('advertise.website')}
                            </label>
                            <input
                                type="url"
                                name="website"
                                value={form.website}
                                onChange={handleChange}
                                placeholder="https://example.com"
                            />
                        </div>
                    </div>

                    {/* Banner Type */}
                    <div className={styles.section}>
                        <h2>{t('advertise.bannerType')}</h2>

                        <div className={styles.bannerTypes}>
                            {BANNER_TYPES.map(type => (
                                <label
                                    key={type.id}
                                    className={`${styles.bannerOption} ${form.bannerType === type.id ? styles.selected : ''}`}
                                >
                                    <input
                                        type="radio"
                                        name="bannerType"
                                        value={type.id}
                                        checked={form.bannerType === type.id}
                                        onChange={handleChange}
                                    />
                                    <div className={styles.bannerInfo}>
                                        <span className={styles.bannerName}>
                                            {t(type.label)}
                                        </span>
                                        <span className={styles.bannerSize}>{type.size}</span>
                                        <span className={styles.bannerPrice}>{type.price}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Duration */}
                    <div className={styles.section}>
                        <h2>{t('advertise.duration')}</h2>

                        <div className={styles.inputGroup}>
                            <label>
                                <BiCalendar size={18} />
                                {t('advertise.monthsCount')}
                            </label>
                            <select name="duration" value={form.duration} onChange={handleChange}>
                                <option value="1">1 {t('advertise.month')}</option>
                                <option value="3">3 {t('advertise.months')}</option>
                                <option value="6">6 {t('advertise.monthsGen')}</option>
                                <option value="12">12 {t('advertise.monthsGen')}</option>
                            </select>
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className={styles.section}>
                        <h2>{t('advertise.bannerImage')}</h2>

                        <div className={styles.uploadArea}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                id="bannerImage"
                                className={styles.fileInput}
                            />
                            <label htmlFor="bannerImage" className={styles.uploadLabel}>
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className={styles.preview} />
                                ) : (
                                    <>
                                        <BiImage size={48} />
                                        <span>{t('advertise.clickUpload')}</span>
                                        <small>{t('advertise.format')}</small>
                                    </>
                                )}
                            </label>
                        </div>
                    </div>

                    {/* Comment */}
                    <div className={styles.section}>
                        <h2>{t('advertise.comment')}</h2>

                        <div className={styles.inputGroup}>
                            <label>
                                <BiMessageDetail size={18} />
                                {t('advertise.additionalInfo')}
                            </label>
                            <textarea
                                name="comment"
                                value={form.comment}
                                onChange={handleChange}
                                placeholder={t('advertise.commentPlaceholder')}
                                rows={4}
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading
                            ? t('advertise.sending')
                            : t('advertise.submit')}
                    </button>
                </form>

                {/* Pricing Info */}
                <aside className={styles.sidebar}>
                    <div className={styles.pricingCard}>
                        <h3>{t('advertise.benefits')}</h3>
                        <ul>
                            <li>✓ {t('advertise.benefit1')}</li>
                            <li>✓ {t('advertise.benefit2')}</li>
                            <li>✓ {t('advertise.benefit3')}</li>
                            <li>✓ {t('advertise.benefit4')}</li>
                        </ul>
                    </div>

                    <div className={styles.contactCard}>
                        <h3>{t('advertise.questions')}</h3>
                        <p>{t('advertise.contactUs')}</p>
                        <a href="tel:+996555123456" className={styles.contactPhone}>+996 555 123 456</a>
                    </div>
                </aside>
            </div>
        </div>
    );
}
