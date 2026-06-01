import styles from "./VideoCard.module.css";
import { catLabel } from "../data/videos.js";

export default function VideoCard({ video }) {
  const locked = !video.free;
  return (
    <article className={`${styles.card} ${locked ? styles.locked : ""}`}>
      <div
        className={styles.thumb}
        style={{ background: `linear-gradient(135deg, ${video.color})` }}
      >
        <span className={styles.emoji}>{video.emoji}</span>
        <span className={styles.play}>
          <span className={styles.tri} />
        </span>
        {locked ? (
          <span className={styles.lock} title="Pro only">🔒</span>
        ) : (
          <span className={styles.free}>FREE</span>
        )}
        <span className={styles.duration}>{video.dur}</span>
      </div>
      <div className={styles.info}>
        <span className={styles.cat}>{catLabel(video.cat)}</span>
        <h3 className={styles.title}>{video.title}</h3>
      </div>
    </article>
  );
}
