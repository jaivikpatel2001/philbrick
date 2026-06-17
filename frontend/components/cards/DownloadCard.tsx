import { FiDownload, FiFileText } from "react-icons/fi";
import type { DownloadItem } from "@/types";
import styles from "./DownloadCard.module.css";

export function DownloadCard({ item }: { item: DownloadItem }) {
  return (
    <a
      href={item.href}
      className={styles.card}
      download
      data-reveal="up"
    >
      <span className={styles.icon}>
        <FiFileText />
      </span>
      <div className={styles.body}>
        <span className={styles.category}>{item.category}</span>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.desc}>{item.description}</p>
        <div className={styles.meta}>
          <span>{item.fileType}</span>
          <span className={styles.dot} />
          <span>{item.fileSize}</span>
        </div>
      </div>
      <span className={styles.action} aria-hidden>
        <FiDownload />
      </span>
    </a>
  );
}
