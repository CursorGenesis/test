"use client";

import Link from 'next/link';
import styles from './not-found.module.css';
import { BiTrafficCone } from 'react-icons/bi';

export default function NotFound() {
    return (
        <div className={styles.container}>
            <div className={styles.iconWrapper}>
                <BiTrafficCone />
            </div>
            <h1 className={styles.title}>404</h1>
            <h2 className={styles.subtitle}>Страница на ремонте</h2>
            <p className={styles.text}>
                Извините, мы не можем найти страницу, которую вы ищете. Возможно, она была удалена или перемещена.
            </p>
            <Link href="/" className={styles.homeButton}>
                Вернуться на главную
            </Link>
        </div>
    );
}
