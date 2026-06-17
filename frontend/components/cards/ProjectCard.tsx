import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import type { Project } from "@/types";
import { cn } from "@/utils/cn";
import styles from "./ProjectCard.module.css";

export function ProjectCard({
  project,
  featured = false,
}: {
  project: Project;
  featured?: boolean;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn(styles.card, featured && styles.featured)}
      data-reveal="up"
    >
      <Image
        src={project.cardImage}
        alt={project.title}
        fill
        sizes={featured ? "100vw" : "(max-width: 900px) 100vw, 50vw"}
        className={styles.img}
      />
      <div className={styles.overlay} />
      <div className={styles.body}>
        <div className={styles.meta}>
          <span>{project.category}</span>
          <span className={styles.dot} />
          <span>{project.location}</span>
        </div>
        <h3 className={styles.title}>{project.title}</h3>
        <p className={styles.summary}>{project.summary}</p>
        <span className={styles.cta}>
          View case study <FiArrowUpRight />
        </span>
      </div>
    </Link>
  );
}
