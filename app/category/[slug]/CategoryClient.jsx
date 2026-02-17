"use client";

import { useState } from 'react';
import styles from './page.module.css';
import { categories, KYRGYZSTAN_LOCATIONS, CATEGORY_FIELDS } from '../../../data/mockData';
import ListingCard from '../../../components/ListingCard/ListingCard';
import Link from 'next/link';
import { useApp } from '../../../context/AppContext';
import { useLanguage } from '../../../context/LanguageContext';

export default function CategoryClient({ slug }) {
    const { listings, isLoaded } = useApp();
    const { t, lang } = useLanguage();
    const category = categories.find(c => c.slug === slug);

    // State for filters
    const [priceFrom, setPriceFrom] = useState('');
    const [priceTo, setPriceTo] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [isFilterOpen, setIsFilterOpen] = useState(false); // For mobile

    // Dynamic Filter State: { fieldName: value }
    const [dynamicFilters, setDynamicFilters] = useState({});

    // Localized category names & descriptions


    if (!category) {
        return (
            <div className={styles.container}>
                <h1>{t('filters.categoryNotFound')}</h1>
                <Link href="/">{t('filters.toHome')}</Link>
            </div>
        );
    }

    // Helper to update dynamic filters
    const handleDynamicChange = (name, value) => {
        setDynamicFilters(prev => {
            if (value === '' || value === false) {
                const newState = { ...prev };
                delete newState[name];
                return newState;
            }
            return { ...prev, [name]: value };
        });
    };

    // --- FILTER LOGIC ---
    let filteredListings = listings.filter(l =>
        l.category?.toLowerCase().includes(category.title.toLowerCase()) ||
        l.categorySlug === slug ||
        l.category?.toLowerCase() === slug
    );

    // Filter by Price
    if (priceFrom) {
        filteredListings = filteredListings.filter(l => {
            const price = parseInt(l.price.replace(/\D/g, '')) || 0;
            return price >= parseInt(priceFrom);
        });
    }
    if (priceTo) {
        filteredListings = filteredListings.filter(l => {
            const price = parseInt(l.price.replace(/\D/g, '')) || 0;
            return price <= parseInt(priceTo);
        });
    }

    // Filter by Region
    if (selectedRegion) {
        const regionLabel = KYRGYZSTAN_LOCATIONS[selectedRegion]?.label[lang] || KYRGYZSTAN_LOCATIONS[selectedRegion]?.label.ru;
        filteredListings = filteredListings.filter(l =>
            l.location.toLowerCase().includes(regionLabel.toLowerCase())
        );
    }

    // Filter by District
    if (selectedDistrict) {
        filteredListings = filteredListings.filter(l =>
            l.location.toLowerCase().includes(selectedDistrict.toLowerCase())
        );
    }

    // --- DYNAMIC FILTERS LOGIC ---
    const categoryConfig = CATEGORY_FIELDS[slug];
    if (categoryConfig && Object.keys(dynamicFilters).length > 0) {
        filteredListings = filteredListings.filter(listing => {
            const data = listing.extendedData || {};
            const specsObj = {};
            if (listing.specs) {
                listing.specs.forEach(s => {
                    specsObj[s.name.toLowerCase()] = s.value;
                });
            }

            return Object.entries(dynamicFilters).every(([key, value]) => {
                const fieldConfig = categoryConfig.fields.find(f => f.name === key);
                let itemValue = data[key];

                if (!itemValue && fieldConfig) {
                    const labelLower = fieldConfig.label.toLowerCase();
                    const specValue = Object.keys(specsObj).find(k => k.includes(labelLower) || k === labelLower);
                    if (specValue) itemValue = specsObj[specValue];
                }

                if (!itemValue) return false;

                if (fieldConfig?.type === 'select') {
                    return itemValue.toString().toLowerCase() === value.toString().toLowerCase();
                }
                if (fieldConfig?.type === 'checkbox') {
                    return !!itemValue === !!value;
                }
                if (fieldConfig?.type === 'text') {
                    return itemValue.toString().toLowerCase().includes(value.toString().toLowerCase());
                }
                if (fieldConfig?.type === 'number') {
                    return parseInt(itemValue) >= parseInt(value);
                }
                if (fieldConfig?.type === 'multiselect') {
                    if (!value) return true;
                    const itemString = Array.isArray(itemValue) ? itemValue.join(' ') : String(itemValue);
                    return itemString.toLowerCase().includes(value.toLowerCase());
                }

                return itemValue.toString().toLowerCase().includes(value.toString().toLowerCase());
            });
        });
    }

    // --- SORT LOGIC ---
    filteredListings = [...filteredListings].sort((a, b) => {
        if (sortBy === 'price_asc') {
            const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
            const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
            return priceA - priceB;
        }
        if (sortBy === 'price_desc') {
            const priceA = parseInt(a.price.replace(/\D/g, '')) || 0;
            const priceB = parseInt(b.price.replace(/\D/g, '')) || 0;
            return priceB - priceA;
        }
        return (b.id || 0) - (a.id || 0);
    });

    const localizedTitle = t(`categories.${slug}`);
    const localizedDesc = t(`categories.${slug}Desc`);
    const dynamicFields = CATEGORY_FIELDS[slug]?.fields || [];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/" className={styles.backLink}>{t('common.back')}</Link>
                <div className={styles.titleRow}>
                    <span className={styles.icon}>{category.icon}</span>
                    <h1 className={styles.title}>{localizedTitle}</h1>
                </div>
                <p className={styles.description}>{localizedDesc}</p>
                <button className={styles.mobileFilterBtn} onClick={() => setIsFilterOpen(!isFilterOpen)}>
                    {t('filters.filters')} {isFilterOpen ? '▲' : '▼'}
                </button>
            </div>

            <div className={styles.content}>
                <aside className={`${styles.filters} ${isFilterOpen ? styles.open : ''}`}>
                    <h3>{t('filters.filters')}</h3>

                    {/* --- COMMON FILTERS --- */}
                    <div className={styles.filterGroup}>
                        <label>{t('common.price')} (сом)</label>
                        <div className={styles.priceInputs}>
                            <input
                                type="number"
                                placeholder={t('filters.priceFrom')}
                                value={priceFrom}
                                onChange={(e) => setPriceFrom(e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder={t('filters.priceTo')}
                                value={priceTo}
                                onChange={(e) => setPriceTo(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className={styles.filterGroup}>
                        <label>{t('common.location')}</label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => {
                                setSelectedRegion(e.target.value);
                                setSelectedDistrict('');
                            }}
                        >
                            <option value="">{t('filters.allRegions')}</option>
                            {Object.entries(KYRGYZSTAN_LOCATIONS).map(([key, data]) => (
                                <option key={key} value={key}>
                                    {data.label[lang] || data.label.ru}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedRegion && (
                        <div className={styles.filterGroup}>
                            <label>{t('filters.district')}</label>
                            <select
                                value={selectedDistrict}
                                onChange={(e) => setSelectedDistrict(e.target.value)}
                            >
                                <option value="">{t('filters.allDistricts')}</option>
                                {KYRGYZSTAN_LOCATIONS[selectedRegion].districts.map(dist => (
                                    <option key={dist} value={dist}>{dist}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* --- DYNAMIC FILTERS --- */}
                    {dynamicFields.length > 0 && (
                        <div className={styles.dynamicFilters}>
                            <hr className={styles.divider} />
                            <h4>{t('filters.specs')}</h4>

                            {dynamicFields.map(field => {
                                return (
                                    <div key={field.name} className={styles.filterGroup}>
                                        <label>{t(`fields.${field.name}`)}</label>

                                        {field.type === 'select' && (
                                            <select
                                                value={dynamicFilters[field.name] || ''}
                                                onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                                            >
                                                <option value="">{t('filters.any')}</option>
                                                {field.options.map(opt => (
                                                    <option key={opt} value={opt}>{t(`options.${opt}`)}</option>
                                                ))}
                                            </select>
                                        )}

                                        {field.type === 'multiselect' && (
                                            <select
                                                value={dynamicFilters[field.name] || ''}
                                                onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                                            >
                                                <option value="">{t('filters.notImportant')}</option>
                                                {field.options.map(opt => (
                                                    <option key={opt} value={opt}>{t(`options.${opt}`)}</option>
                                                ))}
                                            </select>
                                        )}

                                        {(field.type === 'text' || field.type === 'number') && (
                                            <input
                                                type={field.type === 'number' ? 'number' : 'text'}
                                                placeholder={field.placeholder || '...'}
                                                value={dynamicFilters[field.name] || ''}
                                                onChange={(e) => handleDynamicChange(field.name, e.target.value)}
                                            />
                                        )}

                                        {field.type === 'checkbox' && (
                                            <label className={styles.checkboxLabel}>
                                                <input
                                                    type="checkbox"
                                                    checked={!!dynamicFilters[field.name]}
                                                    onChange={(e) => handleDynamicChange(field.name, e.target.checked)}
                                                />
                                                <span>{t('filters.yes')}</span>
                                            </label>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    <button
                        className={styles.resetButton}
                        onClick={() => {
                            setPriceFrom('');
                            setPriceTo('');
                            setSelectedRegion('');
                            setSelectedDistrict('');
                            setDynamicFilters({});
                        }}
                    >
                        {t('filters.reset')}
                    </button>
                </aside>

                <main className={styles.listings}>
                    <div className={styles.resultsHeader}>
                        <span>
                            {isLoaded ? filteredListings.length : 0} {t('filters.found')}
                        </span>
                        <select
                            className={styles.sortSelect}
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="date">{t('filters.date')}</option>
                            <option value="price_asc">{t('filters.cheapFirst')}</option>
                            <option value="price_desc">{t('filters.expensiveFirst')}</option>
                        </select>
                    </div>

                    {!isLoaded ? (
                        <p>{t('common.loading')}</p>
                    ) : filteredListings.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyText}>
                                {t('filters.notFound')}
                            </p>
                            <button
                                className={styles.resetLink}
                                onClick={() => {
                                    setPriceFrom('');
                                    setPriceTo('');
                                    setSelectedRegion('');
                                    setSelectedDistrict('');
                                    setDynamicFilters({});
                                }}
                            >
                                {t('filters.resetFilters')}
                            </button>
                        </div>
                    ) : (
                        <div className={styles.listingsGrid}>
                            {filteredListings.map(listing => (
                                <ListingCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
