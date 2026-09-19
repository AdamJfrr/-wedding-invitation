import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";
import styles from "./Letter.module.css";
import weddingBg from "../../images/wedding.jpg";
import couple from "../../images/couple.png";

export default function Letter() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const wedding = {
    parentsGroom: "Ziad and Nadia Daniel",
    parentsBride: "Moufid and Amira Jaafar",
    groom: "Ehab",
    bride: "Christine",
    invitationText: "have the pleasure of inviting you to attend the wedding celebration of their children",
    schedule: [
      "The celebration will begin at 12:00 noon at Khalia Al-Saleha – Ras Al-Maten.",
      "The wedding procession will depart at 12:30 PM (for the groom's family).",
      "1:00 PM at Dar Al-Balad, Bshatin (for the bride's family).",
      "Reception: from 5:00 PM until 6:30 PM.",
      "The evening festivities will take place at the Al-Rahm Gardens."
    ],
  };

  const handleOpenLetter = () => {
    setIsOpen(true);
    if (audioRef.current) {
      audioRef.current.muted = false;
      audioRef.current.volume = 0.5;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play blocked:", err));
    }
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.muted = false;
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.log("Audio play blocked:", err));
    }
  };

  return (
    <div className={styles.wrapper}>
      <audio ref={audioRef} preload="auto" loop>
        <source src="/wedding.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className={styles.stage}>
        <motion.div
          animate={{
            scale: isOpen ? 1 : 0.85,
            opacity: isOpen ? 1 : 0,
            zIndex: isOpen ? 30 : 1,
          }}
          transition={{
            duration: 1.2,
            ease: [0.16, 1, 0.3, 1],
            delay: isOpen ? 0.8 : 0,
          }}
          className={styles.card}
        >
          <div className={styles.cardContent}>
            {/* Rococo-style Photo Frame matching the requested design */}
            <div className={styles.rococoFrameContainer}>
              <div className={styles.rococoBorder}>
                <div className={styles.rococoTopDecor}></div>
                <img
                  src={couple}
                  alt="Couple"
                  className={styles.rococoPhoto}
                />
                <div className={styles.rococoBottomDecor}></div>
              </div>
            </div>

            <div className={styles.parentsSection}>
              <span className={styles.parentNames}>{wedding.parentsGroom}</span>
              <span className={styles.parentAmpersand}>&</span>
              <span className={styles.parentNames}>{wedding.parentsBride}</span>
            </div>

            <p className={styles.inviteText}>{wedding.invitationText}</p>

            <h1 className={styles.names}>
              {wedding.groom} <span className={styles.nameAnd}>&</span> {wedding.bride}
            </h1>

            <div className={styles.detailsBlock}>
              {wedding.schedule.map((line, index) => (
                <p key={index} className={styles.detailLine}>
                  {line}
                </p>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          animate={{
            rotateY: isOpen ? -180 : 0,
          }}
          transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
          className={styles.leftFlap}
        >
          <img
            src={weddingBg}
            alt="Left Envelope Door"
            className={styles.leftPhoto}
          />
        </motion.div>

        <motion.div
          animate={{
            rotateY: isOpen ? 180 : 0,
          }}
          transition={{ duration: 2.5, ease: [0.4, 0, 0.2, 1] }}
          className={styles.rightFlap}
        >
          <img
            src={weddingBg}
            alt="Right Envelope Door"
            className={styles.rightPhoto}
          />
        </motion.div>

        {!isOpen && (
          <button
            type="button"
            aria-label="Open Invitation"
            className={styles.sealHotspot}
            onClick={handleOpenLetter}
          />
        )}
      </div>

      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        onClick={toggleMusic}
        className={styles.musicToggle}
        aria-label="Toggle Music"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Music On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4" />
            <span>Muted</span>
          </>
        )}
      </motion.button>

      {isOpen && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsOpen(false)}
          className={styles.closeButton}
        >
          Close Envelope
        </motion.button>
      )}
    </div>
  );
}
