"use client";

import { useState, useEffect, useCallback } from 'react';
import styles from './SocialAuth.module.css';
import { FcGoogle } from 'react-icons/fc';
import { FaTelegram, FaWhatsapp } from 'react-icons/fa';
import { useLanguage } from '../../context/LanguageContext';
import { useApp } from '../../context/AppContext';
import { useToast } from '../../context/ToastContext';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SocialAuth() {
    const { t } = useLanguage();
    const { login } = useApp();
    const { showSuccess, showError, showInfo } = useToast();
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(null);

    // Telegram состояние
    const [tgStep, setTgStep] = useState('idle'); // idle | waiting | code_input
    const [tgSessionId, setTgSessionId] = useState(null);
    const [tgCode, setTgCode] = useState('');

    // Поллинг статуса (ждём, пока бот отправит код)
    useEffect(() => {
        if (tgStep !== 'waiting' || !tgSessionId) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/auth/telegram/verify?sessionId=${tgSessionId}`);
                const data = await res.json();

                if (data.status === 'code_sent') {
                    setTgStep('code_input');
                    clearInterval(interval);
                } else if (data.status === 'expired' || !data.status) {
                    setTgStep('idle');
                    setTgSessionId(null);
                    showError('Время ожидания истекло. Попробуйте снова.');
                    clearInterval(interval);
                }
            } catch (err) {
                // Молча ретраим
            }
        }, 2000); // Проверяем каждые 2 секунды

        return () => clearInterval(interval);
    }, [tgStep, tgSessionId]);

    const handleGoogleLogin = () => {
        setIsLoading('google');
        signIn('google', { callbackUrl: '/profile' });
    };

    // Шаг 1: Нажатие кнопки Telegram
    const handleTelegramClick = async () => {
        setIsLoading('telegram');
        try {
            const res = await fetch('/api/auth/telegram/init', { method: 'POST' });
            const data = await res.json();

            if (data.success) {
                setTgSessionId(data.sessionId);
                setTgStep('waiting');

                // Открываем бота в новом окне
                window.open(data.deepLink, '_blank');
            } else {
                showError(data.error || 'Ошибка инициализации');
            }
        } catch (err) {
            showError('Ошибка соединения');
        } finally {
            setIsLoading(null);
        }
    };

    // Шаг 2: Пользователь ввёл код
    const handleVerifyCode = async (e) => {
        e.preventDefault();
        if (!tgCode.trim() || tgCode.length < 6) {
            showError('Введите 6-значный код');
            return;
        }

        setIsLoading('telegram');
        try {
            const res = await fetch('/api/auth/telegram/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sessionId: tgSessionId, code: tgCode.trim() }),
            });
            const data = await res.json();

            if (data.success) {
                login(data.user.name, '', {
                    telegramId: data.user.telegramId,
                    username: data.user.username,
                    provider: 'telegram',
                });

                showSuccess('✅ Вы вошли через Telegram!');
                setTgStep('idle');
                setTgSessionId(null);
                setTgCode('');
                router.push('/profile');
            } else {
                showError(data.error || 'Неверный код');
            }
        } catch (err) {
            showError('Ошибка проверки кода');
        } finally {
            setIsLoading(null);
        }
    };

    const handleCancel = () => {
        setTgStep('idle');
        setTgSessionId(null);
        setTgCode('');
    };

    const handleWhatsAppLogin = () => {
        showInfo('WhatsApp авторизация скоро будет доступна');
    };

    return (
        <div className={styles.container}>
            <div className={styles.divider}>
                <span>{t('socialAuth.orLogin')}</span>
            </div>

            <div className={styles.buttons}>
                {/* Google */}
                <button
                    className={styles.googleBtn}
                    onClick={handleGoogleLogin}
                    disabled={!!isLoading || tgStep !== 'idle'}
                >
                    {isLoading === 'google' ? (
                        <span className={styles.loader}>...</span>
                    ) : (
                        <FcGoogle size={24} />
                    )}
                    <span>Google</span>
                </button>

                {/* Telegram — 3 состояния */}
                {tgStep === 'idle' && (
                    <button
                        className={styles.telegramBtn}
                        onClick={handleTelegramClick}
                        disabled={!!isLoading}
                    >
                        {isLoading === 'telegram' ? (
                            <span className={styles.loader}>...</span>
                        ) : (
                            <FaTelegram size={24} color="#24A1DE" />
                        )}
                        <span>Telegram</span>
                    </button>
                )}

                {tgStep === 'waiting' && (
                    <div className={styles.tgCodeBlock}>
                        <div className={styles.tgWaiting}>
                            <FaTelegram size={20} color="#24A1DE" />
                            <span>Откройте бота и получите код...</span>
                            <span className={styles.spinner}></span>
                        </div>
                        <button className={styles.cancelBtn} onClick={handleCancel}>
                            Отмена
                        </button>
                    </div>
                )}

                {tgStep === 'code_input' && (
                    <form className={styles.tgCodeBlock} onSubmit={handleVerifyCode}>
                        <div className={styles.tgCodeLabel}>
                            <FaTelegram size={18} color="#24A1DE" />
                            <span>Введите код из Telegram:</span>
                        </div>
                        <div className={styles.tgCodeRow}>
                            <input
                                type="text"
                                className={styles.codeInput}
                                value={tgCode}
                                onChange={(e) => setTgCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="______"
                                maxLength={6}
                                autoFocus
                            />
                            <button
                                type="submit"
                                className={styles.verifyBtn}
                                disabled={isLoading === 'telegram'}
                            >
                                {isLoading === 'telegram' ? '...' : '→'}
                            </button>
                        </div>
                        <button type="button" className={styles.cancelBtn} onClick={handleCancel}>
                            Отмена
                        </button>
                    </form>
                )}

                {/* WhatsApp */}
                <button
                    className={styles.whatsappBtn}
                    onClick={handleWhatsAppLogin}
                    disabled={!!isLoading || tgStep !== 'idle'}
                >
                    <FaWhatsapp size={24} color="#25D366" />
                    <span>WhatsApp</span>
                </button>
            </div>
        </div>
    );
}
