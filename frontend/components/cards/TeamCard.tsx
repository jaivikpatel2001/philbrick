import Image from "next/image";
import { FiLinkedin } from "react-icons/fi";
import type { TeamMember } from "@/types";
import styles from "./TeamCard.module.css";

/** Initials from a person's name, e.g. "Vasant Patel" → "VP". */
function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <figure className={styles.card} data-reveal="up">
      <div className={styles.media}>
        {member.image ? (
          <Image
            src={member.image}
            alt={member.name}
            fill
            sizes="(max-width: 700px) 50vw, 25vw"
            className={styles.img}
          />
        ) : (
          <span className={styles.monogram} aria-hidden>
            {initials(member.name)}
          </span>
        )}
        {member.linkedin && (
          <a
            href={member.linkedin}
            className={styles.linkedin}
            aria-label={`${member.name} on LinkedIn`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <FiLinkedin />
          </a>
        )}
      </div>
      <figcaption className={styles.body}>
        <h3 className={styles.name}>{member.name}</h3>
        <p className={styles.role}>{member.role}</p>
        {member.bio && <p className={styles.bio}>{member.bio}</p>}
      </figcaption>
    </figure>
  );
}
