"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './page.module.css';
import { BiImageAdd, BiCheck, BiX } from 'react-icons/bi';
import { categories, CATEGORY_FIELDS, KYRGYZSTAN_LOCATIONS } from '../../data/mockData';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { compressImage } from '../../utils/imageOptimizer';
import { useToast } from '../../context/ToastContext';

export default function SubmitListingPage() {
    const router = useRouter();
    const { user, addListing, isLoaded } = useApp();
    const { t, lang } = useLanguage();
    const { showError, showSuccess } = useToast();
    const fileInputRef = useRef(null);

    // Localized category names
    // Localized category names
    const localizedCategories = [
        { id: 1, slug: 'rent', title: t('categories.rent') },
        { id: 2, slug: 'materials', title: t('categories.materials') },
        { id: 3, slug: 'services', title: t('categories.workers') },
        { id: 4, slug: 'tools', title: t('categories.tools') },
    ];

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        price: '',
        description: '',
    });

    // Location State
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');

    // Extended fields state
    const [extendedData, setExtendedData] = useState({});
    const [selectedServices, setSelectedServices] = useState([]); // For multiselect

    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Get current category fields
    const currentCategoryFields = CATEGORY_FIELDS[formData.category] || null;

    // Reset extended data when category changes
    useEffect(() => {
        setExtendedData({});
        setSelectedServices([]);
    }, [formData.category]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleExtendedChange = (e) => {
        const { name, value, type, checked } = e.target;
        setExtendedData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleService = (service) => {
        setSelectedServices(prev =>
            prev.includes(service)
                ? prev.filter(s => s !== service)
                : [...prev, service]
        );
    };

    const handleImageChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showError(lang === 'ru' ? 'Пожалуйста, выберите изображение' : 'Сүрөт тандаңыз');
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showError(lang === 'ru' ? 'Размер файла слишком большой (макс 10 МБ)' : 'Файл өтө чоң (макс 10 МБ)');
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        try {
            const compressedBase64 = await compressImage(file, 1000, 0.8);
            setImageBase64(compressedBase64);
        } catch {
            showError(lang === 'ru' ? 'Ошибка обработки фото' : 'Сүрөттү иштетүүдө ката кетти');
        }
    };

    const removeImage = () => {
        if (imagePreview && imagePreview.startsWith('blob:')) {
            URL.revokeObjectURL(imagePreview);
        }
        setImagePreview(null);
        setImageBase64(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            showError(lang === 'ru' ? 'Пожалуйста, войдите в аккаунт' : 'Аккаунтка кириңиз', t('common.error'));
            router.push('/profile');
            return;
        }

        if (!imageBase64) {
            showError(lang === 'ru' ? 'Пожалуйста, добавьте фотографию' : 'Сүрөт кошуңуз');
            return;
        }

        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 500));

        const categoryObj = categories.find(c => c.slug === formData.category);

        // Build specs from extended data
        const specs = [];
        if (currentCategoryFields) {
            currentCategoryFields.fields.forEach(field => {
                let value = extendedData[field.name];

                // Handle multiselect
                if (field.type === 'multiselect' && selectedServices.length > 0) {
                    value = selectedServices.join(', ');
                }

                // Handle checkboxes
                if (field.type === 'checkbox') {
                    value = value ? 'Да' : null;
                }

                if (value && value !== '') {
                    specs.push({ name: field.name, value: String(value) });
                }
            });
        }

        // Format Location
        let fullLocation = '';
        if (selectedRegion) {
            const regionLabel = KYRGYZSTAN_LOCATIONS[selectedRegion]?.label[lang] || KYRGYZSTAN_LOCATIONS[selectedRegion]?.label.ru;
            fullLocation = regionLabel;
            if (selectedDistrict) {
                fullLocation += `, ${selectedDistrict}`;
            }
        }

        const newListing = addListing({
            title: formData.title,
            category: categoryObj?.title || formData.category,
            categorySlug: formData.category,
            price: formData.price + (formData.price.includes('сом') || formData.price.includes('₽') ? '' : ' сом'),
            description: formData.description,
            location: fullLocation,
            image: imageBase64,
            specs,
            extendedData: { ...extendedData, serviceType: selectedServices },
        });

        setSuccess(true);

        setTimeout(() => {
            router.push(`/listing/${newListing.id}`);
        }, 1500);
    };

    // Render dynamic field based on type
    const renderField = (field) => {
        switch (field.type) {
            case 'select':
                return (
                    <div className={styles.formGroup} key={field.name}>
                        <label className={styles.label}>
                            {t(`fields.${field.name}`)}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        <select
                            name={field.name}
                            className={styles.select}
                            value={extendedData[field.name] || ''}
                            onChange={handleExtendedChange}
                            required={field.required}
                        >
                            <option value="">{t('submit.selectCategory') || 'Выберите...'}</option>
                            {field.options.map(opt => (
                                <option key={opt} value={opt}>{t(`options.${opt}`)}</option>
                            ))}
                        </select>
                    </div>
                );

            case 'multiselect':
                return (
                    <div className={styles.formGroup} key={field.name}>
                        <label className={styles.label}>
                            {t(`fields.${field.name}`)}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        <div className={styles.multiSelect}>
                            {field.options.map(opt => (
                                <button
                                    type="button"
                                    key={opt}
                                    className={`${styles.multiOption} ${selectedServices.includes(opt) ? styles.selected : ''}`}
                                    onClick={() => toggleService(opt)}
                                >
                                    {t(`options.${opt}`)}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 'checkbox':
                return (
                    <label className={styles.checkboxLabel} key={field.name}>
                        <input
                            type="checkbox"
                            name={field.name}
                            checked={extendedData[field.name] || false}
                            onChange={handleExtendedChange}
                            className={styles.checkbox}
                        />
                        <span className={styles.checkboxText}>{t(`fields.${field.name}`)}</span>
                    </label>
                );

            case 'number':
                return (
                    <div className={styles.formGroup} key={field.name}>
                        <label className={styles.label}>{t(`fields.${field.name}`)}</label>
                        <input
                            type="number"
                            name={field.name}
                            placeholder={field.placeholder || ''}
                            className={styles.input}
                            value={extendedData[field.name] || ''}
                            onChange={handleExtendedChange}
                        />
                    </div>
                );

            default: // text
                return (
                    <div className={styles.formGroup} key={field.name}>
                        <label className={styles.label}>{t(`fields.${field.name}`)}</label>
                        <input
                            type="text"
                            name={field.name}
                            placeholder={field.placeholder || ''}
                            className={styles.input}
                            value={extendedData[field.name] || ''}
                            onChange={handleExtendedChange}
                        />
                    </div>
                );
        }
    };

    if (!isLoaded) {
        return <div className={styles.container}><p>{t('common.loading')}</p></div>;
    }

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}><BiCheck size={48} /></div>
                    <h1>{t('submit.success')}</h1>
                    <p>{t('submit.redirecting')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>{t('submit.title')}</h1>

            {!user && (
                <div className={styles.warning}>
                    ⚠️ {t('submit.notLoggedIn')} <Link href="/profile">{t('submit.loginLink')}</Link>
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>
                {/* Basic Info Section */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>{t('submit.basicInfo')}</h2>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('submit.titleLabel')}<span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            name="title"
                            placeholder={t('submit.titlePlaceholder')}
                            className={styles.input}
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('submit.categoryLabel')}<span className={styles.required}>*</span></label>
                            <select
                                name="category"
                                className={styles.select}
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">{t('submit.selectCategory')}</option>
                                {localizedCategories.map(cat => (
                                    <option key={cat.id} value={cat.slug}>{cat.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('submit.priceLabel')}<span className={styles.required}>*</span></label>
                            <input
                                type="text"
                                name="price"
                                placeholder={t('submit.pricePlaceholder')}
                                className={styles.input}
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.row}>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('common.location')}<span className={styles.required}>*</span></label>
                            <select
                                className={styles.select}
                                value={selectedRegion}
                                onChange={(e) => {
                                    setSelectedRegion(e.target.value);
                                    setSelectedDistrict('');
                                }}
                                required
                            >
                                <option value="">{t('submit.selectRegion')}</option>
                                {Object.entries(KYRGYZSTAN_LOCATIONS).map(([key, data]) => (
                                    <option key={key} value={key}>
                                        {data.label[lang] || data.label.ru}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>{t('filters.district')}</label>
                            <select
                                className={styles.select}
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                                disabled={!selectedRegion}
                            >
                                <option value="">{t('submit.selectDistrict')}</option>
                                {selectedRegion && KYRGYZSTAN_LOCATIONS[selectedRegion].districts.map(dist => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Extended Fields Section - Only shows when category selected */}
                {currentCategoryFields && (
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>⚙️ {t('filters.specs')}</h2>

                        <div className={styles.extendedFieldsGrid}>
                            {currentCategoryFields.fields.filter(f => f.type !== 'checkbox' && f.type !== 'multiselect').map(renderField)}
                        </div>

                        {/* Multiselect fields */}
                        {currentCategoryFields.fields.filter(f => f.type === 'multiselect').map(renderField)}

                        {/* Checkbox fields */}
                        <div className={styles.checkboxGroup}>
                            {currentCategoryFields.fields.filter(f => f.type === 'checkbox').map(renderField)}
                        </div>
                    </div>
                )}

                {/* Description Section */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>{t('submit.descriptionSection')}</h2>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('submit.descriptionLabel')}<span className={styles.required}>*</span></label>
                        <textarea
                            name="description"
                            rows="5"
                            placeholder={t('submit.descriptionPlaceholder')}
                            className={styles.textarea}
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                </div>

                {/* Photo Section */}
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>{t('submit.photoSection')}</h2>

                    <div className={styles.formGroup}>
                        {imagePreview ? (
                            <div className={styles.imagePreviewWrapper}>
                                <div className={styles.imagePreview}>
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    className={styles.removeImageBtn}
                                    onClick={removeImage}
                                >
                                    <BiX size={20} /> {t('submit.removePhoto')}
                                </button>
                            </div>
                        ) : (
                            <div
                                className={styles.photoUpload}
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <BiImageAdd size={40} color="#F59E0B" />
                                <span>{t('submit.photoHint')}</span>
                                <span className={styles.photoHint}>{t('submit.photoFormat')}</span>
                            </div>
                        )}

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className={styles.hiddenInput}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className={styles.submitButton}
                    disabled={isSubmitting}
                >
                    {isSubmitting
                        ? t('submit.submitting')
                        : t('submit.publishButton')}
                </button>
            </form>
        </div>
    );
}
