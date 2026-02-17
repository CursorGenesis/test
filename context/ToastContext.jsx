"use client";

import { createContext, useContext, useState, useCallback } from 'react';
import Toast from '../components/Toast/Toast';
import styles from '../components/Toast/Toast.module.css';

const ToastContext = createContext(undefined);

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((type, message, title = '') => {
        const id = Date.now() + Math.random();
        setToasts(prev => [...prev, { id, type, message, title }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    }, []);

    // Convenience methods
    const showSuccess = (message, title = 'Успешно') => addToast('success', message, title);
    const showError = (message, title = 'Ошибка') => addToast('error', message, title);
    const showInfo = (message, title = 'Информация') => addToast('info', message, title);

    const value = {
        addToast,
        removeToast,
        showSuccess,
        showError,
        showInfo
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <div className={styles.container}>
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        {...toast}
                        onClose={removeToast}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
}

export function useToast() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
}
