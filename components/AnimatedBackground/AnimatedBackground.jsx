'use client';
import styles from './AnimatedBackground.module.css';

export default function AnimatedBackground() {
    return (
        <div className={styles.backgroundContainer}>
            {/* Layer 1: Animated Blueprint Grid */}
            <svg className={styles.grid} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                <defs>
                    <pattern id="smallGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#F59E0B" strokeWidth="0.3" />
                    </pattern>
                    <pattern id="largeGrid" width="200" height="200" patternUnits="userSpaceOnUse">
                        <rect width="200" height="200" fill="url(#smallGrid)" />
                        <path d="M 200 0 L 0 0 0 200" fill="none" stroke="#F59E0B" strokeWidth="0.5" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#largeGrid)" />
            </svg>

            {/* Layer 2: Animated Construction Elements */}
            <div className={styles.elementsLayer}>

                {/* WORKING CRANE - arm swings, cable moves */}
                <svg className={styles.crane} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    {/* Tower */}
                    <rect x="90" y="60" width="20" height="140" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                    <line x1="90" y1="80" x2="110" y2="80" stroke="#F59E0B" strokeWidth="1" />
                    <line x1="90" y1="100" x2="110" y2="100" stroke="#F59E0B" strokeWidth="1" />
                    <line x1="90" y1="120" x2="110" y2="120" stroke="#F59E0B" strokeWidth="1" />
                    <line x1="90" y1="140" x2="110" y2="140" stroke="#F59E0B" strokeWidth="1" />
                    <line x1="90" y1="160" x2="110" y2="160" stroke="#F59E0B" strokeWidth="1" />
                    {/* Base */}
                    <rect x="70" y="195" width="60" height="5" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                    {/* Swinging Arm */}
                    <g className={styles.craneArm}>
                        <line x1="100" y1="60" x2="180" y2="40" stroke="#F59E0B" strokeWidth="2" />
                        <line x1="100" y1="60" x2="40" y2="50" stroke="#F59E0B" strokeWidth="1.5" />
                        {/* Counterweight */}
                        <rect x="25" y="45" width="20" height="15" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        {/* Cable */}
                        <line className={styles.cable} x1="160" y1="45" x2="160" y2="100" stroke="#F59E0B" strokeWidth="1" />
                        {/* Hook */}
                        <path className={styles.hook} d="M155 100 L165 100 L165 110 Q165 120 160 120 Q155 120 155 110 Z" stroke="#F59E0B" strokeWidth="1" fill="none" />
                    </g>
                </svg>

                {/* SPINNING GEARS */}
                <svg className={styles.gearSet} viewBox="0 0 150 150" xmlns="http://www.w3.org/2000/svg">
                    {/* Big Gear */}
                    <g className={styles.gearBig}>
                        <circle cx="60" cy="75" r="35" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                        <circle cx="60" cy="75" r="15" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        {/* Teeth */}
                        <rect x="55" y="35" width="10" height="8" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <rect x="55" y="107" width="10" height="8" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <rect x="20" y="70" width="8" height="10" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <rect x="92" y="70" width="8" height="10" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <rect x="30" y="45" width="8" height="8" stroke="#F59E0B" strokeWidth="1" fill="none" transform="rotate(-45 34 49)" />
                        <rect x="82" y="45" width="8" height="8" stroke="#F59E0B" strokeWidth="1" fill="none" transform="rotate(45 86 49)" />
                        <rect x="30" y="97" width="8" height="8" stroke="#F59E0B" strokeWidth="1" fill="none" transform="rotate(45 34 101)" />
                        <rect x="82" y="97" width="8" height="8" stroke="#F59E0B" strokeWidth="1" fill="none" transform="rotate(-45 86 101)" />
                    </g>
                    {/* Small Gear */}
                    <g className={styles.gearSmall}>
                        <circle cx="105" cy="50" r="20" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                        <circle cx="105" cy="50" r="8" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        {/* Teeth */}
                        <rect x="100" y="26" width="10" height="6" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <rect x="100" y="68" width="10" height="6" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <rect x="81" y="45" width="6" height="10" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <rect x="123" y="45" width="6" height="10" stroke="#F59E0B" strokeWidth="1" fill="none" />
                    </g>
                </svg>

                {/* WORKING EXCAVATOR - arm digs */}
                <svg className={styles.excavator} viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg">
                    {/* Body */}
                    <rect x="60" y="70" width="80" height="40" rx="5" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                    {/* Cabin */}
                    <rect x="100" y="45" width="35" height="30" rx="3" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                    <rect x="105" y="50" width="20" height="15" stroke="#F59E0B" strokeWidth="0.5" fill="none" />
                    {/* Tracks */}
                    <ellipse cx="100" cy="125" rx="55" ry="15" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                    <circle cx="55" cy="125" r="12" stroke="#F59E0B" strokeWidth="1" fill="none" />
                    <circle cx="145" cy="125" r="12" stroke="#F59E0B" strokeWidth="1" fill="none" />
                    {/* Animated Arm */}
                    <g className={styles.excavatorArm}>
                        {/* Boom */}
                        <line x1="70" y1="65" x2="30" y2="35" stroke="#F59E0B" strokeWidth="2.5" />
                        {/* Stick */}
                        <line x1="30" y1="35" x2="10" y2="70" stroke="#F59E0B" strokeWidth="2" />
                        {/* Bucket */}
                        <path d="M5 70 L15 70 L20 85 L0 85 Z" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                        {/* Bucket teeth */}
                        <line x1="5" y1="85" x2="5" y2="90" stroke="#F59E0B" strokeWidth="1" />
                        <line x1="10" y1="85" x2="10" y2="90" stroke="#F59E0B" strokeWidth="1" />
                        <line x1="15" y1="85" x2="15" y2="90" stroke="#F59E0B" strokeWidth="1" />
                    </g>
                </svg>

                {/* ROTATING CEMENT MIXER */}
                <svg className={styles.mixer} viewBox="0 0 120 100" xmlns="http://www.w3.org/2000/svg">
                    {/* Truck body */}
                    <rect x="10" y="60" width="60" height="25" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                    {/* Cabin */}
                    <path d="M10 60 L10 45 L30 45 L35 60" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                    <rect x="12" y="48" width="15" height="10" stroke="#F59E0B" strokeWidth="0.5" fill="none" />
                    {/* Wheels */}
                    <circle cx="25" cy="90" r="8" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                    <circle cx="55" cy="90" r="8" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                    {/* Rotating Drum */}
                    <g className={styles.drum}>
                        <ellipse cx="85" cy="50" rx="25" ry="35" stroke="#F59E0B" strokeWidth="1.5" fill="none" />
                        {/* Spiral lines on drum */}
                        <path d="M65 35 Q85 50 65 65" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <path d="M75 25 Q95 50 75 75" stroke="#F59E0B" strokeWidth="1" fill="none" />
                        <path d="M95 20 Q110 50 95 80" stroke="#F59E0B" strokeWidth="1" fill="none" />
                    </g>
                    {/* Support */}
                    <line x1="70" y1="60" x2="85" y2="85" stroke="#F59E0B" strokeWidth="1.5" />
                </svg>

                {/* PULSING WARNING LIGHT */}
                <div className={styles.warningLight}>
                    <svg viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                        <circle className={styles.lightGlow} cx="25" cy="25" r="20" />
                        <circle cx="25" cy="25" r="12" stroke="#F59E0B" strokeWidth="2" fill="none" />
                        <circle cx="25" cy="25" r="6" fill="#F59E0B" className={styles.lightCore} />
                    </svg>
                </div>

                {/* FLOATING PARTICLES */}
                <div className={styles.particles}>
                    <span className={styles.particle}></span>
                    <span className={styles.particle}></span>
                    <span className={styles.particle}></span>
                    <span className={styles.particle}></span>
                    <span className={styles.particle}></span>
                </div>
            </div>

            {/* Layer 3: Ambient glow */}
            <div className={styles.ambientGlow} />
        </div>
    );
}
