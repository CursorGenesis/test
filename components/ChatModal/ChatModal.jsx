"use client";

import { useState, useRef, useEffect } from 'react';
import styles from './ChatModal.module.css';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { BiX, BiSend } from 'react-icons/bi';

export default function ChatModal({ requestId, requestName, isAdmin = false, onClose }) {
    const { getMessages, addMessage } = useApp();
    const { lang } = useLanguage();
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const messages = getMessages(requestId);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        addMessage(requestId, newMessage.trim(), isAdmin);
        setNewMessage('');
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return t('chat.today');
        } else if (date.toDateString() === yesterday.toDateString()) {
            return t('chat.yesterday');
        }
        return date.toLocaleDateString('ru-RU');
    };

    // Group messages by date
    const groupedMessages = messages.reduce((groups, message) => {
        const date = formatDate(message.createdAt);
        if (!groups[date]) {
            groups[date] = [];
        }
        groups[date].push(message);
        return groups;
    }, {});

    return (
        <div className={styles.overlay} onClick={onClose}>
            <div className={styles.modal} onClick={e => e.stopPropagation()}>
                <div className={styles.header}>
                    <div className={styles.headerInfo}>
                        <h3>{t('chat.title')}</h3>
                        <span className={styles.requestName}>{requestName}</span>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <BiX size={24} />
                    </button>
                </div>

                <div className={styles.messages}>
                    {messages.length === 0 ? (
                        <div className={styles.emptyChat}>
                            <p>
                                {t('chat.startDialog')}
                            </p>
                        </div>
                    ) : (
                        Object.entries(groupedMessages).map(([date, dateMessages]) => (
                            <div key={date} className={styles.dateGroup}>
                                <div className={styles.dateDivider}>
                                    <span>{date}</span>
                                </div>
                                {dateMessages.map(message => (
                                    <div
                                        key={message.id}
                                        className={`${styles.message} ${message.isAdmin === isAdmin ? styles.own : styles.other
                                            }`}
                                    >
                                        <div className={styles.bubble}>
                                            <span className={styles.senderName}>{message.senderName}</span>
                                            <p>{message.text}</p>
                                            <span className={styles.time}>{formatTime(message.createdAt)}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ))
                    )}
                    <div ref={messagesEndRef} />
                </div>

                <form className={styles.inputArea} onSubmit={handleSend}>
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('chat.placeholder')}
                        className={styles.input}
                    />
                    <button type="submit" className={styles.sendBtn} disabled={!newMessage.trim()}>
                        <BiSend size={20} />
                    </button>
                </form>
            </div>
        </div>
    );
}
