import React, { useState, useRef, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX, MessageCircle } from "lucide-react";
import styles from "./Letter.module.css";
import weddingBg from "../../images/wedding.jpg";
import couple from "../../images/couple.png";

// Location Map Links
const MAPS_KHALIAT = "https://www.google.com/maps/search/?api=1&query=33.849041,35.654476";
const MAPS_BCHEFTINE = "https://www.google.com/maps/search/?api=1&query=33.7117,35.5514";

const LocationPin = () => (
  <svg
    className={styles.locationPin}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const LocationLink = ({ text, href }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={styles.locationLink}
  >
    <LocationPin />
    <span>{text}</span>
  </a>
);

const wedding = {
  groom: "Ehab",
  bride: "Christine",
  invitationText:
    "have the pleasure of inviting you to attend the wedding celebration on 17-10-2026",
  schedule: [
    {
      id: 1,
      prefix: "The celebration will begin at 12:00 noon at ",
      location: "Khaliat Al-Salha – Ras Al-Maten",
      mapUrl: MAPS_KHALIAT,
      suffix: ".",
    },
    {
      id: 2,
      text: "The wedding procession will depart at 12:30 PM (for the groom's family).",
    },
    {
      id: 3,
      prefix: "1:30 PM at ",
      location: "Dar Al-Balda, Bchetfine",
      mapUrl: MAPS_BCHEFTINE,
      suffix: " (for the bride's family).",
    },
    {
      id: 4,
      prefix: "Reception: from 5:00 PM until 6:30 PM at ",
      location: "Khaliat Al-Salha – Ras Al-Maten",
      mapUrl: MAPS_KHALIAT,
      suffix: ".",
    },
    {
      id: 5,
      prefix: "The evening festivities will take place at 8:30 PM at ",
      location: "Khaliat Al-Salha – Ras Al-Maten",
      mapUrl: MAPS_KHALIAT,
      suffix: ".",
    },
  ],
  // RSVP WhatsApp Numbers (Formatted without + or spaces for WhatsApp URL)
  groomWhatsapp: "4915561798504",
  brideWhatsapp: "96176756266",
};

export default function Letter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const cardRef = useRef(null);
  const reduceMotion = useReducedMotion();

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date("2026-10-17T00:00:00").getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const playAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.muted = false;
    audio.volume = 0.5;
    const attempt = audio.play();
    if (attempt && typeof attempt.then === "function") {
      attempt
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play blocked:", err));
    } else {
      setIsPlaying(true);
    }
  };

  const handleOpenLetter = () => {
    if (cardRef.current) cardRef.current.scrollTop = 0;
    setIsOpen(true);
    playAudio();
  };

  const toggleMusic = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      playAudio();
    }
  };

  const flapTransition = {
    duration: reduceMotion ? 0.4 : 2.5,
    ease: [0.4, 0, 0.2, 1],
  };

  // Pre-filled WhatsApp response messages
  const groomMsg = encodeURIComponent(
    `Hello Ehab, I would love to confirm my attendance for your wedding on 17-10-2026!`
  );
  const brideMsg = encodeURIComponent(
    `Hello Christine, I would love to confirm my attendance for your wedding on 17-10-2026!`
  );

  return (
    <div className={styles.wrapper}>
      <audio ref={audioRef} preload="auto" loop>
        <source src="/wedding.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className={styles.stage}>
        <motion.div
          ref={cardRef}
          animate={{
            scale: isOpen ? 1 : 0.85,
            opacity: isOpen ? 1 : 0,
            zIndex: isOpen ? 30 : 1,
          }}
          transition={{
            duration: reduceMotion ? 0.4 : 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: isOpen ? (reduceMotion ? 0.1 : 0.8) : 0,
          }}
          style={{ pointerEvents: isOpen ? "auto" : "none" }}
          aria-hidden={!isOpen}
          className={styles.card}
        >
          <div className={styles.cardContent}>
            <div className={styles.rococoFrameContainer}>
              <div className={styles.rococoBorder}>
                <img
                  src={couple}
                  alt="Ehab and Christine"
                  className={styles.rococoPhoto}
                  decoding="async"
                />
              </div>
            </div>

            <h1 className={styles.names}>
              {wedding.groom} <span className={styles.nameAnd}>&amp;</span>{" "}
              {wedding.bride}
            </h1>

            <p className={styles.inviteText}>{wedding.invitationText}</p>

            {/* Schedule Section with Interactive Map Links */}
            <div className={styles.scheduleSection}>
              <h2 className={styles.scheduleTitle}>Schedule</h2>
              <div className={styles.detailsBlock}>
                {wedding.schedule.map((item) => (
                  <p key={item.id} className={styles.detailLine}>
                    {item.location ? (
                      <>
                        {item.prefix}
                        <LocationLink text={item.location} href={item.mapUrl} />
                        {item.suffix}
                      </>
                    ) : (
                      item.text
                    )}
                  </p>
                ))}
              </div>
            </div>

            {/* Countdown Timer */}
            <div className={styles.countdownContainer}>
              <div className={styles.countdownBox}>
                <span className={styles.countdownNumber}>{timeLeft.days}</span>
                <span className={styles.countdownLabel}>Days</span>
              </div>
              <span className={styles.countdownColon}>:</span>
              <div className={styles.countdownBox}>
                <span className={styles.countdownNumber}>{timeLeft.hours}</span>
                <span className={styles.countdownLabel}>Hours</span>
              </div>
              <span className={styles.countdownColon}>:</span>
              <div className={styles.countdownBox}>
                <span className={styles.countdownNumber}>{timeLeft.minutes}</span>
                <span className={styles.countdownLabel}>Minutes</span>
              </div>
              <span className={styles.countdownColon}>:</span>
              <div className={styles.countdownBox}>
                <span className={styles.countdownNumber}>{timeLeft.seconds}</span>
                <span className={styles.countdownLabel}>Seconds</span>
              </div>
            </div>

            {/* RSVP Section */}
            <div className={styles.rsvpSection}>
              <h2 className={styles.rsvpTitle}>RSVP</h2>
              <p className={styles.rsvpSubtitle}>
                Please kindly confirm your presence via WhatsApp
              </p>
              <div className={styles.rsvpActions}>
                <a
                  href={`https://wa.me/${wedding.groomWhatsapp}?text=${groomMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.rsvpButton}
                >
                  <MessageCircle size={15} aria-hidden="true" />
                  <span>RSVP Groom (Ehab)</span>
                </a>
                <a
                  href={`https://wa.me/${wedding.brideWhatsapp}?text=${brideMsg}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${styles.rsvpButton} ${styles.rsvpSecondary}`}
                >
                  <MessageCircle size={15} aria-hidden="true" />
                  <span>RSVP Bride (Christine)</span>
                </a>
              </div>
            </div>

            {isOpen && (
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className={styles.closeButton}
              >
                Close Envelope
              </button>
            )}
          </div>
        </motion.div>

        <motion.div
          animate={{ rotateY: isOpen ? -180 : 0 }}
          transition={flapTransition}
          className={styles.leftFlap}
        >
          <img
            src={weddingBg}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={styles.leftPhoto}
          />
        </motion.div>

        <motion.div
          animate={{ rotateY: isOpen ? 180 : 0 }}
          transition={flapTransition}
          className={styles.rightFlap}
        >
          <img
            src={weddingBg}
            alt=""
            aria-hidden="true"
            draggable={false}
            className={styles.rightPhoto}
          />
        </motion.div>

        {!isOpen && (
          <button
            type="button"
            aria-label="Open invitation"
            className={styles.sealHotspot}
            onClick={handleOpenLetter}
          />
        )}
      </div>

      <motion.button
        type="button"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className={styles.musicToggle}
        aria-label={isPlaying ? "Mute music" : "Play music"}
      >
        {isPlaying ? (
          <>
            <Volume2 size={14} aria-hidden="true" />
            <span>Music On</span>
          </>
        ) : (
          <>
            <VolumeX size={14} aria-hidden="true" />
            <span>Muted</span>
          </>
        )}
      </motion.button>
    </div>
  );
}
