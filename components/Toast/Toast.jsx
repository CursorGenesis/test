"use client";

import { useEffect } from 'react';
import styles from './Toast.module.css';
import { BiCheckCircle, BiErrorCircle, BiInfoCircle, BiX } from 'react-icons/bi';

const icons = {
    success: <BiCheckCircle />,
    error: <BiErrorCircle />,
    info: <BiInfoCircle />
};

export default function Toast({ id, type = 'info', title, message, onClose, duration = 5000 }) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <div className={`${styles.toast} ${styles[type]}`}>
            <div className={styles.icon}>
                {icons[type]}
            </div>
            <div className={styles.content}>
                {title && <div className={styles.title}>{title}</div>}
                <div className={styles.message}>{message}</div>
            </div>
            <button className={styles.closeBtn} onClick={() => onClose(id)}>
                <BiX />
            </button>
        </div>
    );
}
