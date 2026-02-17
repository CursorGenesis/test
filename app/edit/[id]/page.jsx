"use client";

import { useState, useRef, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../submit/page.module.css'; // Reuse styles
import { BiImageAdd, BiCheck, BiX } from 'react-icons/bi';
import { categories, CATEGORY_FIELDS } from '../../../data/mockData';
import { useApp } from '../../../context/AppContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useToast } from '../../../context/ToastContext';
import { compressImage } from '../../../utils/imageOptimizer';
import Link from 'next/link';
import Image from 'next/image';

export default function EditListingPage({ params }) {
    const resolvedParams = use(params);
    const { id } = resolvedParams;
    const router = useRouter();
    const { user, getListingById, updateListing, isLoaded } = useApp();
    const { t, lang } = useLanguage();
    const { showError } = useToast();
    const fileInputRef = useRef(null);

    const [listing, setListing] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

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
        location: '',
    });

    const [extendedData, setExtendedData] = useState({});
    const [selectedServices, setSelectedServices] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageBase64, setImageBase64] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);

    // Load listing data
    useEffect(() => {
        if (!isLoaded) return;

        const foundListing = getListingById(id);
        if (!foundListing) {
            showError(t('edit.notFound'));
            router.push('/profile');
            return;
        }

        // Check ownership
        if (!user || foundListing.seller?.phone !== user.phone) {
            showError(t('edit.noPermission'));
            router.push('/');
            return;
        }

        setListing(foundListing);

        // Populate form
        setFormData({
            title: foundListing.title,
            category: foundListing.categorySlug || categories.find(c => c.title === foundListing.category)?.slug || '',
            price: foundListing.price.replace(' сом', '').replace(' ₽', ''),
            description: foundListing.description || '',
            location: foundListing.location,
        });

        if (foundListing.image) {
            setImagePreview(foundListing.image);
            setImageBase64(foundListing.image);
        }

        // Populate extended data
        if (foundListing.extendedData) {
            const { serviceType, ...others } = foundListing.extendedData;
            setExtendedData(others);
            if (Array.isArray(serviceType)) {
                setSelectedServices(serviceType);
            }
        }

        setIsLoading(false);

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isLoaded, id, user]);

    const currentCategoryFields = CATEGORY_FIELDS[formData.category] || null;

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
            showError(t('edit.selectImage'));
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            showError(t('edit.fileTooBig'));
            return;
        }

        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);

        try {
            const compressedBase64 = await compressImage(file, 1000, 0.8);
            setImageBase64(compressedBase64);
        } catch {
            showError(t('edit.errorProcessing'));
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

        if (!user) return;
        if (!imageBase64) {
            showError(t('edit.addPhoto'));
            return;
        }

        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 500));

        const categoryObj = categories.find(c => c.slug === formData.category);

        // Build specs
        const specs = [];
        if (currentCategoryFields) {
            currentCategoryFields.fields.forEach(field => {
                let value = extendedData[field.name];
                if (field.type === 'multiselect' && selectedServices.length > 0) {
                    value = selectedServices.join(', ');
                }
                if (field.type === 'checkbox') {
                    value = value ? 'on' : null;
                }
                if (value && value !== '') {
                    // We might need to translate field labels here, but they come from MOCK data currently
                    // Ideally mock data should be replaced or keys used.
                    // For now, let's keep it as is, or use t() if we can map it.
                    // The field names in MOCK data are Russian.
                    // We might need a bigger refactor for dynamic field names translation.
                    specs.push({ name: field.label, value: String(value) });
                }
            });
        }

        updateListing(id, {
            title: formData.title,
            category: categoryObj?.title || formData.category,
            categorySlug: formData.category,
            price: formData.price + (formData.price.includes('сом') || formData.price.includes('₽') ? '' : ' сом'),
            description: formData.description,
            location: formData.location,
            image: imageBase64,
            specs,
            extendedData: { ...extendedData, serviceType: selectedServices },
        });

        setSuccess(true);

        setTimeout(() => {
            router.push(`/listing/${id}`);
        }, 1500);
    };

    const renderField = (field) => {
        // Translation for field labels should ideally be handled here using t() if keys existed
        // But for now we are fixing static page text.
        switch (field.type) {
            case 'select':
                return (
                    <div className={styles.formGroup} key={field.name}>
                        <label className={styles.label}>
                            {field.label}
                            {field.required && <span className={styles.required}>*</span>}
                        </label>
                        <select
                            name={field.name}
                            className={styles.select}
                            value={extendedData[field.name] || ''}
                            onChange={handleExtendedChange}
                            required={field.required}
                        >
                            <option value="">{t('submit.select')}</option>
                            {field.options.map(opt => (
                                <option key={opt} value={opt}>{opt}</option>
                            ))}
                        </select>
                    </div>
                );
            case 'multiselect':
                return (
                    <div className={styles.formGroup} key={field.name}>
                        <label className={styles.label}>
                            {field.label}
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
                                    {opt}
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
                        <span className={styles.checkboxText}>{field.label}</span>
                    </label>
                );
            case 'number':
                return (
                    <div className={styles.formGroup} key={field.name}>
                        <label className={styles.label}>{field.label}</label>
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
            default:
                return (
                    <div className={styles.formGroup} key={field.name}>
                        <label className={styles.label}>{field.label}</label>
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

    if (isLoading || !isLoaded) {
        return <div className={styles.container}><p>{t('common.loading')}</p></div>;
    }

    if (success) {
        return (
            <div className={styles.container}>
                <div className={styles.successCard}>
                    <div className={styles.successIcon}><BiCheck size={48} /></div>
                    <h1>{t('edit.saved')}</h1>
                    <p>{t('edit.redirecting')}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.pageTitle}>{t('edit.title')}</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>📝 {t('edit.mainInfo')}</h2>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('submit.titleLabel')}<span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            name="title"
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
                                className={styles.input}
                                value={formData.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('submit.locationLabel')}<span className={styles.required}>*</span></label>
                        <input
                            type="text"
                            name="location"
                            className={styles.input}
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {currentCategoryFields && (
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>⚙️ {currentCategoryFields.title}</h2>
                        <div className={styles.extendedFieldsGrid}>
                            {currentCategoryFields.fields.filter(f => f.type !== 'checkbox' && f.type !== 'multiselect').map(renderField)}
                        </div>
                        {currentCategoryFields.fields.filter(f => f.type === 'multiselect').map(renderField)}
                        <div className={styles.checkboxGroup}>
                            {currentCategoryFields.fields.filter(f => f.type === 'checkbox').map(renderField)}
                        </div>
                    </div>
                )}

                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>📄 {t('edit.description')}</h2>
                    <div className={styles.formGroup}>
                        <label className={styles.label}>{t('submit.descriptionLabel')}<span className={styles.required}>*</span></label>
                        <textarea
                            name="description"
                            rows="5"
                            className={styles.textarea}
                            value={formData.description}
                            onChange={handleChange}
                            required
                        ></textarea>
                    </div>
                </div>

                <div className={styles.formSection}>
                    <h2 className={styles.sectionTitle}>📷 {t('edit.photo')}</h2>
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
                                <button type="button" className={styles.removeImageBtn} onClick={removeImage}>
                                    <BiX size={20} /> {t('submit.removePhoto')}
                                </button>
                            </div>
                        ) : (
                            <div className={styles.photoUpload} onClick={() => fileInputRef.current?.click()}>
                                <BiImageAdd size={40} color="#F59E0B" />
                                <span>{t('submit.photoHint')}</span>
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

                <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
                    {isSubmitting ? t('edit.saving') : t('edit.save')}
                </button>
            </form>
        </div>
    );
}
