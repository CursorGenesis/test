"use client";

import styles from '../static-pages.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function AboutClient() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('about.title')}</h1>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('about.whoWeAre')}</h2>
                <p className={styles.text}>
                    {t('about.whoWeAreDesc1')}
                </p>
                <p className={styles.text}>
                    {t('about.whoWeAreDesc2')}
                </p>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('about.important')}</h2>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        <strong>{t('about.important1Title')}</strong> {t('about.important1Desc')}
                    </li>
                    <li className={styles.listItem}>
                        <strong>{t('about.important2Title')}</strong> {t('about.important2Desc')}
                    </li>
                    <li className={styles.listItem}>
                        <strong>{t('about.important3Title')}</strong> {t('about.important3Desc')}
                    </li>
                </ul>
            </section>

            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>{t('about.mission')}</h2>
                <p className={styles.text}>
                    {t('about.missionDesc')}
                </p>
            </section>
        </div>
    );
}
