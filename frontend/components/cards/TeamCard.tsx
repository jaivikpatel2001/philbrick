import Image from "next/image";
import { FiLinkedin } from "react-icons/fi";
import type { TeamMember } from "@/types";
import styles from "./TeamCard.module.css";

export function TeamCard({ member }: { member: TeamMember }) {
  return (
    <figure className={styles.card} data-reveal="up">
      <div className={styles.media}>
        <Image
          src={member.image}
          alt={member.name}
          fill
          sizes="(max-width: 700px) 50vw, 25vw"
          className={styles.img}
        />
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
