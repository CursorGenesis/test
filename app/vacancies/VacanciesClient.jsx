"use client";

import styles from '../static-pages.module.css';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function VacanciesClient() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('vacancies.title')}</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('vacancies.seekers')}</h2>
                <p className={styles.text}>
                    {t('vacancies.seekersDesc1')}
                </p>
                <p className={styles.text}>
                    {t('vacancies.seekersDesc2')}
                </p>
                <div style={{ marginTop: '1rem' }}>
                    <Link href="/submit" className={styles.button} style={{
                        display: 'inline-block',
                        background: '#F59E0B',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '0.5rem',
                        fontWeight: '600',
                        textDecoration: 'none'
                    }}>
                        {t('vacancies.postResume')}
                    </Link>
                </div>
                <p className={styles.text} style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
                    {t('vacancies.seekersNote')}
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('vacancies.employers')}</h2>
                <p className={styles.text}>
                    {t('vacancies.employersDesc')}
                </p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        {t('vacancies.viewResumes')} <Link href="/category/services" style={{ color: '#F59E0B' }}>{t('vacancies.viewResumesLink')}</Link>.
                    </li>
                    <li className={styles.listItem}>
                        {t('vacancies.postVacancy')}
                    </li>
                </ul>
            </section>
        </div>
    );
}
