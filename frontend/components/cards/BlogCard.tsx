import Link from "next/link";
import Image from "next/image";
import type { BlogPost } from "@/types";
import { formatDate } from "@/utils/format";
import { cn } from "@/utils/cn";
import styles from "./BlogCard.module.css";

export function BlogCard({
  post,
  featured = false,
}: {
  post: BlogPost;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(styles.card, featured && styles.featured)}
      data-reveal="up"
    >
      <div className={styles.media}>
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          sizes={featured ? "(max-width: 900px) 100vw, 55vw" : "(max-width: 900px) 100vw, 33vw"}
          className={styles.img}
        />
      </div>
      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.cat}>{post.category}</span>
          <span>{formatDate(post.date)}</span>
          <span className={styles.dot} />
          <span>{post.readingTime}</span>
        </div>
        <h3 className={styles.title}>{post.title}</h3>
        <p className={styles.excerpt}>{post.excerpt}</p>
        <div className={styles.author}>
          <span className={styles.avatar}>{post.author.charAt(0)}</span>
          <span>
            {post.author} · <span className={styles.role}>{post.authorRole}</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
