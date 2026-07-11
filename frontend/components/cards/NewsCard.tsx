import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import type { NewsItem } from "@/data/news";
import { formatDate } from "@/utils/format";
import styles from "./NewsCard.module.css";

/** News/event card — links to its detail page. */
export function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link
      href={`/news-events/${item.slug}`}
      className={styles.card}
      data-reveal="up"
    >
      <div className={styles.media}>
        <Image
          src={item.image}
          alt={item.imageAlt}
          fill
          sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
          className={styles.img}
        />
        <span className={styles.type}>{item.type}</span>
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.cat}>{item.category}</span>
          <span className={styles.dot} aria-hidden />
          <time dateTime={item.date}>{formatDate(item.date)}</time>
        </div>
        <h3 className={styles.title}>{item.title}</h3>
        <p className={styles.excerpt}>{item.excerpt}</p>
        <span className={styles.more}>
          Read more <FiArrowUpRight aria-hidden />
        </span>
      </div>
    </Link>
  );
}
