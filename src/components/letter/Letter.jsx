import React, { useState, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import styles from "./Letter.module.css";
import weddingBg from "../../images/wedding.jpg";
import couple from "../../images/couple.png";

const wedding = {
  parentsGroom: "Ziad and Nadia Daniel",
  parentsBride: "Moufid and Amira Jaafar",
  groom: "Ehab",
  bride: "Christine",
  invitationText:
    "have the pleasure of inviting you to attend the wedding celebration of their children",
  schedule: [
    "The celebration will begin at 12:00 noon at Khalia Al-Saleha – Ras Al-Maten.",
    "The wedding procession will depart at 12:30 PM (for the groom's family).",
    "1:00 PM at Dar Al-Balad, Bshatin (for the bride's family).",
    "Reception: from 5:00 PM until 6:30 PM.",
    "The evening festivities will take place at the Al-Rahm Gardens.",
  ],
};

export default function Letter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const cardRef = useRef(null);
  const reduceMotion = useReducedMotion();

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
    // Always start at the top of the invitation
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

            <div className={styles.parentsSection}>
              <span className={styles.parentNames}>{wedding.parentsGroom}</span>
              <span className={styles.parentAmpersand}>&amp;</span>
              <span className={styles.parentNames}>{wedding.parentsBride}</span>
            </div>

            <p className={styles.inviteText}>{wedding.invitationText}</p>

            <h1 className={styles.names}>
              {wedding.groom} <span className={styles.nameAnd}>&amp;</span>{" "}
              {wedding.bride}
            </h1>

            <div className={styles.detailsBlock}>
              {wedding.schedule.map((line) => (
                <p key={line} className={styles.detailLine}>
                  {line}
                </p>
              ))}
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