"use client";

import Link from 'next/link';
import Image from 'next/image';
import styles from './ListingCard.module.css';
import { BiMap, BiShow, BiHeart } from 'react-icons/bi';

import { useApp } from '../../context/AppContext';

export default function ListingCard({ listing }) {
    const { formatPrice } = useApp();

    return (
        <Link href={`/listing/${listing.id}`} className={styles.card}>
            <div className={styles.imageWrapper}>
                <Image
                    src={listing.image}
                    alt={listing.title}
                    fill
                    className={styles.image}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className={styles.categoryBadge}>{listing.category}</div>
            </div>
            <div className={styles.content}>
                <h3 className={styles.title}>{listing.title}</h3>
                <p className={styles.price}>{formatPrice(listing.price)}</p>
                <div className={styles.location}>
                    <BiMap size={16} />
                    <span>{listing.location}</span>
                </div>
            </div>
        </Link>
    );
}
