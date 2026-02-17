"use client";

import styles from '../static-pages.module.css';
import Link from 'next/link';
import { useLanguage } from '../../context/LanguageContext';

export default function HelpClient() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('help.title')}</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('help.faq')}</h2>

                <div className={styles.faqItem}>
                    <div className={styles.question}>{t('help.q1')}</div>
                    <div className={styles.answer}>
                        {t('help.a1')} <Link href="/submit" style={{ color: '#F59E0B', textDecoration: 'underline' }}>{t('help.a1_link')}</Link> {t('help.a1_end')}
                    </div>
                </div>

                <div className={styles.faqItem}>
                    <div className={styles.question}>{t('help.q2')}</div>
                    <div className={styles.answer}>
                        {t('help.a2')}
                    </div>
                </div>

                <div className={styles.faqItem}>
                    <div className={styles.question}>{t('help.q3')}</div>
                    <div className={styles.answer}>
                        {t('help.a3')}
                    </div>
                </div>

                <div className={styles.faqItem}>
                    <div className={styles.question}>{t('help.q4')}</div>
                    <div className={styles.answer}>
                        {t('help.a4')} <Link href="/profile" style={{ color: '#F59E0B', textDecoration: 'underline' }}>{t('help.a4_link')}</Link>. {t('help.a4_end')}
                    </div>
                </div>
            </section>
        </div>
    );
}
