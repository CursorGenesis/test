"use client";

import styles from '../static-pages.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function ContactsClient() {
    const { t } = useLanguage();

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{t('contacts.title')}</h1>

            <section className={styles.section}>
                <p className={styles.text}>
                    {t('contacts.intro')}
                </p>

                <div className={styles.contactGrid}>
                    <div className={styles.contactCard}>
                        <div className={styles.contactLabel}>{t('contacts.supportPhone')}</div>
                        <div className={styles.contactValue}>+996 555 123 456</div>
                    </div>

                    <div className={styles.contactCard}>
                        <div className={styles.contactLabel}>{t('contacts.email')}</div>
                        <div className={styles.contactValue}>support@stroymarket.kg</div>
                    </div>

                    <div className={styles.contactCard}>
                        <div className={styles.contactLabel}>{t('contacts.addressTitle')}</div>
                        <div className={styles.contactValue}>{t('contacts.address')}</div>
                    </div>

                    <div className={styles.contactCard}>
                        <div className={styles.contactLabel}>{t('contacts.scheduleTitle')}</div>
                        <div className={styles.contactValue}>{t('contacts.schedule')}</div>
                    </div>
                </div>
            </section>
        </div>
    );
}
