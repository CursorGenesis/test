"use client";

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';
import { BiCamera, BiUser, BiSave, BiX, BiZoomIn, BiZoomOut, BiCheck, BiLeftArrowAlt } from 'react-icons/bi';
import { useApp } from '../../../context/AppContext';
import { useLanguage } from '../../../context/LanguageContext';
import { useToast } from '../../../context/ToastContext';
import { compressImage } from '../../../utils/imageOptimizer';
import Link from 'next/link';
import Image from 'next/image';

export default function ProfileSettingsPage() {
    const router = useRouter();
    const { user, updateUser, isLoaded } = useApp();
    const { t, lang } = useLanguage();
    const { showError } = useToast();
    const fileInputRef = useRef(null);

    const [name, setName] = useState('');
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarBase64, setAvatarBase64] = useState(null);
    const [isSaving, setIsSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    // Cropper State
    const [editMode, setEditMode] = useState(false);
    const [imageToCrop, setImageToCrop] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
    const imageRef = useRef(null);
    const containerRef = useRef(null);
    const dragStartRef = useRef(null);

    useEffect(() => {
        if (isLoaded && !user) {
            router.push('/profile');
        }
        if (user) {
            setName(user.name || '');
            if (user.avatar) {
                setAvatarPreview(user.avatar);
                setAvatarBase64(user.avatar);
            }
        }
    }, [user, isLoaded, router]);

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            showError(t('profile.photoError'));
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            showError(t('profile.sizeError'));
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImageToCrop(reader.result);
            setEditMode(true);
            setCrop({ x: 0, y: 0 });
            setZoom(1);
        };
        reader.readAsDataURL(file);
    };

    const handleImageLoad = (e) => {
        const { naturalWidth, naturalHeight } = e.currentTarget;
        // Fit image into 320x320 container (matching CSS)
        const scale = Math.max(320 / naturalWidth, 320 / naturalHeight);
        setImgSize({ width: naturalWidth * scale, height: naturalHeight * scale });
        setZoom(1);
    };

    // Drag Logic
    const handleDragStart = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        dragStartRef.current = { x: clientX - crop.x, y: clientY - crop.y };
    };

    const handleDragMove = (e) => {
        if (!dragStartRef.current) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;

        setCrop({
            x: clientX - dragStartRef.current.x,
            y: clientY - dragStartRef.current.y
        });
    };

    const handleDragEnd = () => {
        dragStartRef.current = null;
    };

    const performCrop = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const finalSize = 300; // Output resolution
        canvas.width = finalSize;
        canvas.height = finalSize;

        const image = imageRef.current;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, finalSize, finalSize);

        const displayWidth = imgSize.width * zoom;
        const displayHeight = imgSize.height * zoom;

        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            displayWidth,
            displayHeight
        );

        // Get blob from canvas to compress
        canvas.toBlob(async (blob) => {
            if (blob) {
                try {
                    // Compress the blob result
                    const compressedBase64 = await compressImage(blob, 300, 0.9);
                    setAvatarPreview(compressedBase64);
                    setAvatarBase64(compressedBase64);
                    setEditMode(false);
                } catch {
                    // Compression failed — keep original
                }
            }
        }, 'image/jpeg', 0.95);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        // Simulate network delay
        await new Promise(r => setTimeout(r, 800));

        updateUser({
            name,
            avatar: avatarBase64
        });

        setSuccess(true);
        setIsSaving(false);

        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    };

    if (!isLoaded || !user) {
        return <div className={styles.container}>Loading...</div>;
    }

    return (
        <div className={styles.container}>
            <Link href="/profile" style={{ display: 'inline-flex', alignItems: 'center', color: '#F59E0B', marginBottom: '1rem', textDecoration: 'none' }}>
                <BiLeftArrowAlt size={24} /> {t('common.back')}
            </Link>

            <h1 className={styles.pageTitle}>{t('profile.settingsTitle')}</h1>

            {editMode && (
                <div className={styles.cropperModal}>
                    <div className={styles.cropperContent}>
                        <h3 className={styles.cropperHeader}>
                            {t('profile.cropTitle')}
                        </h3>
                        <div
                            className={styles.cropperContainer}
                            ref={containerRef}
                            onMouseDown={handleDragStart}
                            onMouseMove={handleDragMove}
                            onMouseUp={handleDragEnd}
                            onMouseLeave={handleDragEnd}
                            onTouchStart={handleDragStart}
                            onTouchMove={handleDragMove}
                            onTouchEnd={handleDragEnd}
                        >
                            {imageToCrop && (
                                <img
                                    ref={imageRef}
                                    src={imageToCrop}
                                    alt="Crop"
                                    className={styles.cropperImage}
                                    style={{
                                        width: imgSize.width,
                                        height: imgSize.height,
                                        transform: `translate(${crop.x}px, ${crop.y}px) scale(${zoom})`
                                    }}
                                    onLoad={handleImageLoad}
                                    draggable={false}
                                />
                            )}
                            <div className={styles.cropperOverlay} />
                        </div>

                        <div className={styles.controls}>
                            <div className={styles.zoomContainer}>
                                <small>-</small>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="3"
                                    step="0.05"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className={styles.zoomSlider}
                                />
                                <small>+</small>
                            </div>
                            <div className={styles.cropperActions}>
                                <button className={styles.cancelBtn} onClick={() => setEditMode(false)}>
                                    {t('profile.cancel')}
                                </button>
                                <button className={styles.cropBtn} onClick={performCrop}>
                                    {t('profile.select')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form}>

                <div className={styles.avatarSection}>
                    <div className={styles.avatarPreview}>
                        {avatarPreview ? (
                            <Image
                                src={avatarPreview}
                                alt="Avatar"
                                fill
                                style={{ objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#333' }}>
                                <BiUser size={64} color="#666" />
                            </div>
                        )}
                    </div>

                    <button
                        type="button"
                        className={styles.uploadButton}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <BiCamera size={20} />
                        {t('profile.changePhoto')}
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className={styles.hiddenInput}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('profile.nameLabel')}</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={t('profile.enterName')}
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.label}>{t('profile.phoneLabel')}</label>
                    <input
                        type="text"
                        className={styles.input}
                        value={user.phone}
                        disabled
                        style={{ opacity: 0.7, cursor: 'not-allowed' }}
                    />
                    <small style={{ color: '#737373', fontSize: '0.8rem' }}>
                        {t('profile.phoneHint')}
                    </small>
                </div>

                {success && (
                    <div className={styles.successMessage}>
                        <BiCheck size={24} />
                        {t('edit.saved')}
                    </div>
                )}

                <button
                    type="submit"
                    className={styles.saveButton}
                    disabled={isSaving}
                >
                    {isSaving
                        ? t('edit.saving')
                        : t('edit.save')}
                </button>
            </form>
        </div>
    );
}
