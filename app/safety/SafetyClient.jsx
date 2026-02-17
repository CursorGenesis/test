"use client";

import styles from '../static-pages.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function SafetyClient() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('safety.title')}</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle} style={{ color: '#dc2626', borderColor: '#dc2626' }}>{t('safety.disclaimerTitle')}</h2>
                <p className={styles.text}>
                    <strong>{t('safety.disclaimerIntro')}</strong>
                </p>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        {t('safety.disclaimer1')}
                    </li>
                    <li className={styles.listItem}>
                        {t('safety.disclaimer2')}
                    </li>
                    <li className={styles.listItem}>
                        {t('safety.disclaimer3')}
                    </li>
                </ul>
                <p className={styles.text}>
                    {t('safety.disclaimerOutro')}
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('safety.tipsTitle')}</h2>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        <strong>{t('safety.tip1Title')}</strong> {t('safety.tip1Desc')}
                    </li>
                    <li className={styles.listItem}>
                        <strong>{t('safety.tip2Title')}</strong> {t('safety.tip2Desc')}
                    </li>
                    <li className={styles.listItem}>
                        <strong>{t('safety.tip3Title')}</strong> {t('safety.tip3Desc')}
                    </li>
                </ul>
            </section>
        </div>
    );
}
