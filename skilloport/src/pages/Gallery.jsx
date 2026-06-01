import { useState, useMemo } from "react";
import VideoCard from "../components/VideoCard.jsx";
import { VIDEOS, CATEGORIES } from "../data/videos.js";
import styles from "./Gallery.module.css";

export default function Gallery() {
  const [filter, setFilter] = useState("all");

  const visible = useMemo(
    () => (filter === "all" ? VIDEOS : VIDEOS.filter((v) => v.cat === filter)),
    [filter]
  );

  return (
    <div className="container section">
      <div className="page-head">
        <span className="eyebrow">The archive</span>
        <h1>Every drop, ever.</h1>
        <p className="section-lead">
          Browse the skills we've dropped. Free ones are open to everyone — the rest unlock
          with Pro.
        </p>
      </div>

      <div className={styles.filters}>
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            className={`${styles.filter} ${filter === c.key ? styles.active : ""}`}
            onClick={() => setFilter(c.key)}
          >
            {c.label}
          </button>
        ))}
      </div>

      {visible.length ? (
        <div className={styles.grid}>
          {visible.map((v) => (
            <VideoCard key={v.title} video={v} />
          ))}
        </div>
      ) : (
        <p className={styles.empty}>No drops in this category yet — check back Sunday.</p>
      )}
    </div>
  );
}
