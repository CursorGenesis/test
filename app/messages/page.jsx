"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import styles from './page.module.css';
import { BiArrowBack, BiSend, BiUser, BiImage } from 'react-icons/bi';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import Link from 'next/link';

import { Suspense } from 'react';

function MessagesContent() {
    const { user, getConversations, getDirectMessages, sendDirectMessage, isLoaded } = useApp();
    const { t, lang } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();

    const [conversations, setConversations] = useState([]);
    const [activeConversationId, setActiveConversationId] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Initial load
    useEffect(() => {
        if (isLoaded && user) {
            const convs = getConversations();
            setConversations(convs);

            const paramId = searchParams.get('id');
            if (paramId) {
                // If ID is passed, select it. If it's a new conversation created in Listing Page, it should exist now.
                const target = convs.find(c => c.id === paramId);
                if (target) {
                    setActiveConversationId(paramId);
                }
            } else if (convs.length > 0 && window.innerWidth > 768) {
                // Select first by default on desktop
                setActiveConversationId(convs[0].id);
            }
        }
    }, [isLoaded, user, searchParams]);

    // Load messages when active conversation changes
    useEffect(() => {
        if (activeConversationId) {
            setMessages(getDirectMessages(activeConversationId));
            // Mark as read could go here
        }
    }, [activeConversationId, conversations]); // conversations dependency to update when sending

    // Scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeConversationId) return;

        sendDirectMessage(activeConversationId, newMessage);
        setNewMessage('');

        // Refresh conversations to show updated last message
        setConversations(getConversations());
        setMessages(getDirectMessages(activeConversationId));
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const getOtherParticipantName = (conv) => {
        return conv.sellerPhone === user.phone ? conv.buyerName : conv.sellerName;
    };

    if (!isLoaded) return <div className={styles.container}>{t('common.loading')}</div>;

    if (!user) {
        router.push('/profile');
        return null;
    }

    const activeConv = conversations.find(c => c.id === activeConversationId);

    return (
        <div className={`${styles.container} ${activeConversationId ? styles.showChat : ''}`}>
            <div className={styles.chatLayout}>
                {/* Sidebar */}
                <div className={`${styles.sidebar} ${activeConversationId ? styles.hiddenOnMobile : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <h2 className={styles.sidebarTitle}>{lang === 'ru' ? 'Сообщения' : 'Билдирүүлөр'}</h2>
                    </div>
                    <div className={styles.conversationList}>
                        {conversations.length === 0 ? (
                            <div className={styles.noConversations}>
                                {lang === 'ru' ? 'У вас пока нет диалогов' : 'Сизде азырынча диалогдор жок'}
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv.id}
                                    className={`${styles.conversationItem} ${activeConversationId === conv.id ? styles.active : ''}`}
                                    onClick={() => setActiveConversationId(conv.id)}
                                >
                                    <div className={styles.conversationHeader}>
                                        <span className={styles.contactName}>{getOtherParticipantName(conv)}</span>
                                        <span className={styles.timestamp}>{formatTime(conv.updatedAt)}</span>
                                    </div>
                                    <div className={styles.listingInfo}>
                                        <BiImage size={14} />
                                        <span>{conv.listingTitle}</span>
                                    </div>
                                    <div className={styles.lastMessage}>
                                        {conv.lastMessage || (lang === 'ru' ? 'Изображение' : 'Сүрөт')}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                <div className={`${styles.chatArea} ${!activeConversationId ? styles.hiddenOnMobile : ''}`}>
                    {activeConversationId && activeConv ? (
                        <>
                            <div className={styles.chatHeader}>
                                <button className={styles.backButton} onClick={() => setActiveConversationId(null)}>
                                    <BiArrowBack size={24} />
                                </button>
                                <div className={styles.chatHeaderInfo}>
                                    <span className={styles.chatContactName}>{getOtherParticipantName(activeConv)}</span>
                                    <Link href={`/listing/${activeConv.listingId}`} className={styles.chatListingLink}>
                                        {activeConv.listingTitle}
                                    </Link>
                                </div>
                            </div>

                            <div className={styles.messagesList}>
                                {messages.map(msg => (
                                    <div
                                        key={msg.id}
                                        className={`${styles.messageBubble} ${msg.senderId === user.phone ? styles.sent : styles.received}`}
                                    >
                                        {msg.text}
                                        <span className={styles.messageTime}>{formatTime(msg.createdAt)}</span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className={styles.inputArea}>
                                <form onSubmit={handleSendMessage} className={styles.inputForm}>
                                    <input
                                        type="text"
                                        className={styles.input}
                                        placeholder={lang === 'ru' ? 'Напишите сообщение...' : 'Билдирүү жазыңыз...'}
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                    />
                                    <button type="submit" className={styles.sendButton} disabled={!newMessage.trim()}>
                                        <BiSend size={24} />
                                    </button>
                                </form>
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyState}>
                            <div className={styles.emptyIcon}>💬</div>
                            <p>{lang === 'ru' ? 'Выберите диалог для начала общения' : 'Баарлашууну баштоо үчүн диалогду тандаңыз'}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MessagesPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <MessagesContent />
        </Suspense>
    );
}
