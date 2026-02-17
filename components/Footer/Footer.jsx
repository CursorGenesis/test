"use client";

import Link from 'next/link';
import styles from './Footer.module.css';
import { FaTelegramPlane, FaWhatsapp, FaInstagram } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';

export default function Footer() {
    const { t } = useLanguage();

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.column}>
                    <Link href="/" className={styles.logo}>
                        Stroy<span className={styles.logoAccent}>Market</span>
                    </Link>
                    <p className={styles.description}>
                        {t('footer.description')}
                    </p>
                </div>

                <div className={styles.column}>
                    <h4>{t('footer.company')}</h4>
                    <Link href="/about">{t('footer.about')}</Link>
                    <Link href="/contacts">{t('footer.contacts')}</Link>
                    <Link href="/vacancies">{t('footer.vacancies')}</Link>
                </div>

                <div className={styles.column}>
                    <h4>{t('footer.clients')}</h4>
                    <Link href="/help">{t('footer.help')}</Link>
                    <Link href="/terms">{t('footer.rules')}</Link>
                    <Link href="/safety">{t('footer.safety')}</Link>
                </div>

                <div className={styles.column}>
                    <h4>{t('footer.social')}</h4>
                    <div className={styles.socials}>
                        <a href="#" className={styles.socialLink}><FaTelegramPlane /></a>
                        <a href="#" className={styles.socialLink}><FaWhatsapp /></a>
                        <a href="#" className={styles.socialLink}><FaInstagram /></a>
                    </div>
                </div>
            </div>
            <div className={styles.copyright}>
                {t('footer.copyright')}
            </div>
        </footer>
    );
}
