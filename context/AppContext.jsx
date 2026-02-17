"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { featuredListings as initialListings } from '../data/mockData';
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react';

const AppContext = createContext(undefined);

export function AppProvider({ children }) {
    const { data: session } = useSession();
    const [user, setUser] = useState(null);
    const [listings, setListings] = useState([]);

    // Sync NextAuth Session to App User
    useEffect(() => {
        if (session?.user && !user) {
            // Check if we already have this user in localStorage to avoid overwriting extended data
            const storedUser = localStorage.getItem('stroymarket_user');
            if (storedUser) {
                const parsedUser = JSON.parse(storedUser);
                if (parsedUser.email === session.user.email) {
                    setUser(parsedUser);
                    return;
                }
            }

            // New social login
            const newUser = {
                id: Date.now(),
                name: session.user.name,
                email: session.user.email,
                avatar: session.user.image,
                phone: '', // Google doesn't provide phone by default
                isAdmin: false,
                createdAt: new Date().toISOString(),
                provider: 'google'
            };
            setUser(newUser);
        }
    }, [session]);
    const [favorites, setFavorites] = useState([]);
    const [adRequests, setAdRequests] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    // --- User-to-User Chat State ---
    const [conversations, setConversations] = useState([]);
    const [directMessages, setDirectMessages] = useState([]);

    const [analytics, setAnalytics] = useState({
        pageViews: [],
        clicks: [],
        sessions: []
    });
    const [isLoaded, setIsLoaded] = useState(false);
    const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

    // Load from localStorage on mount
    useEffect(() => {
        const loadJSON = (key) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : null;
            } catch {
                return null;
            }
        };

        const storedUser = loadJSON('stroymarket_user');
        const storedListings = loadJSON('stroymarket_listings');
        const storedFavorites = loadJSON('stroymarket_favorites');

        if (storedUser) setUser(storedUser);
        if (storedListings) {
            setListings(storedListings);
        } else {
            setListings(initialListings);
            // Don't immediately save default listings to save space
            // localStorage.setItem('stroymarket_listings', JSON.stringify(initialListings));
        }
        if (storedFavorites) setFavorites(storedFavorites);

        // Load ad requests and messages
        const storedAdRequests = loadJSON('stroymarket_ad_requests');
        const storedChatMessages = loadJSON('stroymarket_chat_messages');
        if (storedAdRequests) setAdRequests(storedAdRequests);
        if (storedChatMessages) setChatMessages(storedChatMessages);

        // Load User-to-User Chat
        const storedConversations = loadJSON('stroymarket_conversations');
        const storedDirectMessages = loadJSON('stroymarket_direct_messages');
        if (storedConversations) setConversations(storedConversations);
        if (storedDirectMessages) setDirectMessages(storedDirectMessages);

        // Load analytics
        const storedAnalytics = loadJSON('stroymarket_analytics');
        if (storedAnalytics) {
            setAnalytics(storedAnalytics);
        }

        setIsLoaded(true);
    }, []);

    // Sync to localStorage on changes
    // Helper for safe storage
    const safeSetItem = (key, value) => {
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // Handle QuotaExceededError specifically
            if (error.name === 'QuotaExceededError' ||
                error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {

                // 1. Remove non-essential data
                try {
                    localStorage.removeItem('stroymarket_analytics');

                    if (key.includes('message') || key.includes('conversation')) {
                        localStorage.removeItem('stroymarket_ad_requests');
                        localStorage.removeItem('stroymarket_listings');
                    }

                    // 2. Retry saving the current item
                    localStorage.setItem(key, JSON.stringify(value));
                } catch (retryError) {
                    // Storage is full even after cleanup — data may be lost on refresh
                }
            }
        }
    };

    useEffect(() => {
        if (isLoaded) {
            safeSetItem('stroymarket_listings', listings);
        }
    }, [listings, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            safeSetItem('stroymarket_favorites', favorites);
        }
    }, [favorites, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            if (user) {
                safeSetItem('stroymarket_user', user);
            } else {
                localStorage.removeItem('stroymarket_user');
            }
        }
    }, [user, isLoaded]);

    // Sync ad requests
    useEffect(() => {
        if (isLoaded) {
            safeSetItem('stroymarket_ad_requests', adRequests);
        }
    }, [adRequests, isLoaded]);

    // Sync chat messages
    useEffect(() => {
        if (isLoaded) {
            safeSetItem('stroymarket_chat_messages', chatMessages);
        }
    }, [chatMessages, isLoaded]);

    // Sync User-to-User Chat
    useEffect(() => {
        if (isLoaded) {
            safeSetItem('stroymarket_conversations', conversations);
        }
    }, [conversations, isLoaded]);

    useEffect(() => {
        if (isLoaded) {
            safeSetItem('stroymarket_direct_messages', directMessages);
        }
    }, [directMessages, isLoaded]);

    // Sync analytics
    useEffect(() => {
        if (isLoaded) {
            // Analytics can grow large, maybe don't store if full?
            try {
                localStorage.setItem('stroymarket_analytics', JSON.stringify(analytics));
            } catch {
                // Analytics storage non-critical — silently skip
            }
        }
    }, [analytics, isLoaded]);

    // --- Actions ---

    const login = (name, phone, additionalData = {}) => {
        const newUser = {
            id: Date.now(),
            name,
            phone,
            isAdmin: false,
            createdAt: new Date().toISOString(),
            ...additionalData // Merge social auth data (avatar, email, provider)
        };
        setUser(newUser);
        return newUser;
    };

    // Admin login via server-side API
    const adminLogin = async (username, password) => {
        try {
            const response = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await response.json();
            if (data.success) {
                setUser(data.user);
            }
            return data;
        } catch {
            return { success: false, error: 'Ошибка сервера' };
        }
    };

    const logout = () => {
        setUser(null);
    };

    const updateUser = (updates) => {
        if (!user) return;
        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);
        return updatedUser;
    };

    const addListing = (listingData) => {
        const newListing = {
            ...listingData,
            id: Date.now(),
            createdAt: new Date().toISOString(),
            seller: user ? { name: user.name, phone: user.phone, rating: 5.0, reviews: 0 } : null,
        };
        setListings(prev => [newListing, ...prev]);
        return newListing;
    };

    const updateListing = (id, updates) => {
        setListings(prev => prev.map(listing =>
            listing.id.toString() === id.toString()
                ? { ...listing, ...updates, updatedAt: new Date().toISOString() }
                : listing
        ));
    };

    const deleteListing = (id) => {
        setListings(prev => prev.filter(listing => listing.id.toString() !== id.toString()));
        // Also remove from favorites
        setFavorites(prev => prev.filter(favId => favId.toString() !== id.toString()));
    };

    const getListingById = (id) => {
        return listings.find(l => l.id.toString() === id.toString());
    };

    const getUserListings = () => {
        if (!user) return [];
        return listings.filter(l => l.seller?.phone === user.phone);
    };

    const toggleFavorite = (listingId) => {
        setFavorites(prev => {
            const isFav = prev.includes(listingId);

            // Update the listing's favorites count
            setListings(currentListings => currentListings.map(l => {
                if (l.id === listingId) {
                    const currentFavs = l.favorites || 0;
                    return {
                        ...l,
                        favorites: isFav ? Math.max(0, currentFavs - 1) : currentFavs + 1
                    };
                }
                return l;
            }));

            if (isFav) {
                return prev.filter(id => id !== listingId);
            } else {
                return [...prev, listingId];
            }
        });
    };

    const isFavorite = (listingId) => {
        return favorites.includes(listingId);
    };

    const incrementListingView = (listingId) => {
        setListings(prev => prev.map(l => {
            if (l.id.toString() === listingId.toString()) {
                // Prevent double counting in same session? For now simple increment
                return { ...l, views: (l.views || 0) + 1 };
            }
            return l;
        }));
    };

    const getFavoriteListings = () => {
        return listings.filter(l => favorites.includes(l.id));
    };

    const searchListings = (query) => {
        const q = query.toLowerCase();
        return listings.filter(l =>
            l.title.toLowerCase().includes(q) ||
            l.description?.toLowerCase().includes(q) ||
            l.category?.toLowerCase().includes(q)
        );
    };

    const getSimilarListings = (currentListing) => {
        if (!currentListing) return [];
        return listings
            .filter(l =>
                l.category === currentListing.category &&
                l.id !== currentListing.id
            )
            .slice(0, 3);
    };

    // --- Stats for Admin ---
    const getStats = () => {
        const uniqueSellers = new Set(listings.map(l => l.seller?.phone).filter(Boolean));
        const categoryCounts = {};
        listings.forEach(l => {
            const cat = l.category || 'Без категории';
            categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
        });

        return {
            totalListings: listings.length,
            totalSellers: uniqueSellers.size,
            totalFavorites: favorites.length,
            categoryCounts,
            pendingAds: adRequests.filter(r => r.status === 'pending').length,
        };
    };

    // --- Ad Requests ---
    const addAdRequest = (data) => {
        const newRequest = {
            ...data,
            id: Date.now(),
            userId: user?.id,
            userName: user?.name || data.name,
            userPhone: user?.phone || data.phone,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };
        setAdRequests(prev => [newRequest, ...prev]);
        return newRequest;
    };

    const updateAdRequest = (id, updates) => {
        setAdRequests(prev => prev.map(req =>
            req.id === id
                ? { ...req, ...updates, updatedAt: new Date().toISOString() }
                : req
        ));
    };

    const getAdRequests = () => adRequests;

    const getUserAdRequests = () => {
        if (!user) return [];
        return adRequests.filter(r => r.userPhone === user.phone);
    };

    const deleteAdRequest = (id) => {
        setAdRequests(prev => prev.filter(req => req.id !== id));
    };

    const clearAllAdRequests = () => {
        setAdRequests([]);
    };

    // --- Analytics ---
    const MAX_ANALYTICS_ENTRIES = 500;

    const trackPageView = (page) => {
        const view = {
            page,
            timestamp: new Date().toISOString(),
            sessionId
        };
        setAnalytics(prev => ({
            ...prev,
            pageViews: [...prev.pageViews, view].slice(-MAX_ANALYTICS_ENTRIES)
        }));
    };

    const trackClick = (type, targetId, extraData = {}) => {
        const click = {
            type,
            targetId,
            timestamp: new Date().toISOString(),
            sessionId,
            ...extraData
        };
        setAnalytics(prev => ({
            ...prev,
            clicks: [...prev.clicks, click].slice(-MAX_ANALYTICS_ENTRIES)
        }));
    };

    const startSession = () => {
        const existingSession = analytics.sessions.find(s => s.sessionId === sessionId);
        if (!existingSession) {
            const session = {
                sessionId,
                startTime: new Date().toISOString(),
                userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown'
            };
            setAnalytics(prev => ({
                ...prev,
                sessions: [...prev.sessions, session]
            }));
        }
    };

    const getAnalytics = () => {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

        const viewsToday = analytics.pageViews.filter(v => v.timestamp >= todayStart).length;
        const viewsWeek = analytics.pageViews.filter(v => v.timestamp >= weekAgo).length;
        const viewsMonth = analytics.pageViews.filter(v => v.timestamp >= monthAgo).length;

        const uniqueSessionsToday = new Set(analytics.pageViews.filter(v => v.timestamp >= todayStart).map(v => v.sessionId)).size;
        const uniqueSessionsWeek = new Set(analytics.pageViews.filter(v => v.timestamp >= weekAgo).map(v => v.sessionId)).size;

        const listingClicks = analytics.clicks.filter(c => c.type === 'listing').length;
        const adClicks = analytics.clicks.filter(c => c.type === 'ad').length;
        const ctaClicks = analytics.clicks.filter(c => c.type === 'cta').length;

        // Page popularity
        const pagePopularity = {};
        analytics.pageViews.forEach(v => {
            pagePopularity[v.page] = (pagePopularity[v.page] || 0) + 1;
        });
        const topPages = Object.entries(pagePopularity)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        // Daily views for chart (last 7 days)
        const dailyViews = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
            const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).toISOString();
            const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).toISOString();
            const count = analytics.pageViews.filter(v => v.timestamp >= dayStart && v.timestamp < dayEnd).length;
            dailyViews.push({
                date: date.toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric' }),
                count
            });
        }

        return {
            viewsToday,
            viewsWeek,
            viewsMonth,
            uniqueSessionsToday,
            uniqueSessionsWeek,
            totalSessions: analytics.sessions.length,
            listingClicks,
            adClicks,
            ctaClicks,
            topPages,
            dailyViews,
            totalPageViews: analytics.pageViews.length,
            totalClicks: analytics.clicks.length
        };
    };

    // --- Chat Messages (Admin) ---
    const addMessage = (requestId, text, isAdmin = false) => {
        const newMessage = {
            id: Date.now(),
            requestId,
            text,
            isAdmin,
            senderName: isAdmin ? 'Администратор' : user?.name || 'Клиент',
            createdAt: new Date().toISOString(),
        };
        setChatMessages(prev => [...prev, newMessage]);
        return newMessage;
    };

    const getMessages = (requestId) => {
        return chatMessages.filter(m => m.requestId === requestId);
    };

    const getUnreadCount = (requestId, isAdmin) => {
        return chatMessages.filter(m =>
            m.requestId === requestId && m.isAdmin !== isAdmin
        ).length;
    };

    // --- User-to-User Chat Actions ---
    const startConversation = (seller, listing) => {
        if (!user) return null;

        // Check if conversation already exists
        const existingConv = conversations.find(c =>
            c.listingId === listing.id &&
            c.participants.includes(user.phone) &&
            c.participants.includes(seller.phone)
        );

        if (existingConv) return existingConv;

        const newConv = {
            id: `c_${Date.now()}`,
            participants: [user.phone, seller.phone],
            listingId: listing.id,
            listingTitle: listing.title,
            listingImage: listing.image,
            sellerName: seller.name,
            sellerPhone: seller.phone,
            buyerName: user.name,
            buyerPhone: user.phone,
            lastMessage: '',
            updatedAt: new Date().toISOString(),
        };

        setConversations(prev => [newConv, ...prev]);
        return newConv;
    };

    const sendDirectMessage = (conversationId, text) => {
        if (!user) return;

        const newMessage = {
            id: `m_${Date.now()}`,
            conversationId,
            senderId: user.phone,
            text,
            createdAt: new Date().toISOString(),
            read: false
        };

        setDirectMessages(prev => [...prev, newMessage]);

        // Update conversation last message
        setConversations(prev => prev.map(c =>
            c.id === conversationId
                ? { ...c, lastMessage: text, updatedAt: new Date().toISOString() }
                : c
        ));

        return newMessage;
    };

    const getConversations = () => {
        if (!user) return [];
        return conversations
            .filter(c => c.participants.includes(user.phone))
            .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    };

    const getDirectMessages = (conversationId) => {
        return directMessages
            .filter(m => m.conversationId === conversationId)
            .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    };

    // --- Currency ---
    const [currency, setCurrency] = useState('KGS'); // 'KGS' or 'USD'
    const EXCHANGE_RATE = 87; // 1 USD = 87 KGS

    const changeCurrency = (newCurrency) => {
        setCurrency(newCurrency);
        safeSetItem('stroymarket_currency', newCurrency);
    };

    const formatPrice = (priceInKgs) => {
        if (!priceInKgs) return '';

        // Clean price string if it comes as "1000 som" etc
        const numPrice = parseInt(String(priceInKgs).replace(/\D/g, ''), 10);
        if (isNaN(numPrice)) return priceInKgs;

        if (currency === 'KGS') {
            return `${numPrice.toLocaleString()} сом`;
        } else {
            const priceInUsd = (numPrice / EXCHANGE_RATE).toFixed(1);
            return `$ ${priceInUsd}`;
        }
    };

    // Load currency from local storage
    useEffect(() => {
        if (isLoaded) {
            const storedCurrency = localStorage.getItem('stroymarket_currency');
            if (storedCurrency) {
                setCurrency(JSON.parse(storedCurrency));
            }
        }
    }, [isLoaded]);

    const value = {
        user,
        listings,
        favorites,
        adRequests,
        chatMessages,
        analytics,
        // New State
        conversations,
        directMessages,
        isLoaded,
        sessionId,
        login,
        adminLogin,
        logout,
        updateUser,
        addListing,
        updateListing,
        deleteListing,
        getListingById,
        getUserListings,
        toggleFavorite,
        isFavorite,
        incrementListingView,
        getFavoriteListings,
        searchListings,
        getSimilarListings,
        getStats,
        // Ad Requests
        addAdRequest,
        updateAdRequest,
        deleteAdRequest,
        clearAllAdRequests,
        getAdRequests,
        getUserAdRequests,
        // Chat
        addMessage,
        getMessages,
        getUnreadCount,
        // User Chat
        startConversation,
        sendDirectMessage,
        getConversations,
        getDirectMessages,
        // Analytics
        trackPageView,
        trackClick,
        startSession,
        getAnalytics,
        // Currency
        currency,
        changeCurrency,
        formatPrice,
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
}
