import { FiStar } from "react-icons/fi";
import { ImQuotesLeft } from "react-icons/im";
import type { Testimonial } from "@/types";
import { cn } from "@/utils/cn";
import styles from "./TestimonialCard.module.css";

export function TestimonialCard({
  testimonial,
  className,
}: {
  testimonial: Testimonial;
  className?: string;
}) {
  const { quote, author, role, company, rating = 5 } = testimonial;
  return (
    <figure className={cn(styles.card, className)} data-reveal="up">
      <ImQuotesLeft className={styles.quoteMark} aria-hidden />
      {rating > 0 && (
        <div className={styles.stars} aria-label={`${rating} out of 5`}>
          {Array.from({ length: rating }).map((_, i) => (
            <FiStar key={i} className={styles.star} />
          ))}
        </div>
      )}
      <blockquote className={styles.quote}>“{quote}”</blockquote>
      <figcaption className={styles.author}>
        <span className={styles.avatar}>{author.charAt(0)}</span>
        <span>
          <span className={styles.name}>{author}</span>
          <span className={styles.role}>
            {role}, {company}
          </span>
        </span>
      </figcaption>
    </figure>
  );
}
