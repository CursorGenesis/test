"use client";

import styles from '../static-pages.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function TermsClient() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('terms.title')}</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('terms.section1')}</h2>
                <p className={styles.text}>
                    {t('terms.section1Desc')}
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('terms.section2')}</h2>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        {t('terms.section2Desc1')}
                    </li>
                    <li className={styles.listItem}>
                        {t('terms.section2Desc2')}
                    </li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('terms.section3')}</h2>
                <p className={styles.text}>
                    {t('terms.section3Desc')}
                </p>
            </section>
        </div>
    );
}
