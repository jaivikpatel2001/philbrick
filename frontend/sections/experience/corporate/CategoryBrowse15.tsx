import Image from "next/image";
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { categoryHref, getCategory } from "@/data/products";
import { CATALOG_PARTS } from "@/data/catalogParts";
import styles from "./corporate.module.css";

/* VARIANT 15 — "Browse by product category": ONE card per catalogue part
   render (components/parts/), so every card carries a UNIQUE image (9 parts →
   9 cards, no duplicated imagery). Each links to its closest real product
   category. */
const CATEGORY_FOR_PART: Record<string, string> = {
  "control-panel-ard": "elevator-control-panel",
  "overload-announcing-device": "elevator-kit-accessories",
  "blower-fan": "elevator-kit-accessories",
  cabin: "elevator-cabin",
  "cop-lop-display": "cop-lop",
  "floor-announcing-system": "voice-announcing-systems",
  "safety-light-curtain": "synergy-auto-door",
  "elevator-door": "elevator-doors",
  "lift-display": "elevator-display",
};

export function CategoryBrowse15() {
  return (
    <section className="section" aria-label="Browse Philbrick components">
      <div className="container--wide">
        <SectionHeader
          eyebrow="Browse the range"
          title="Find it by component"
          description="The core Philbrick components, all engineered and built in-house. Pick one to explore the products inside."
        />
        <ul className={styles.catGrid15} role="list">
          {CATALOG_PARTS.map((p, i) => {
            const slug = CATEGORY_FOR_PART[p.key] ?? "elevator-kit-accessories";
            const cat = getCategory(slug);
            return (
              <li key={p.key} data-reveal="up" style={{ transitionDelay: `${(i % 4) * 60}ms` }}>
                <Link href={categoryHref(slug)} className={styles.catCard15}>
                  <span className={styles.catMedia15}>
                    <Image
                      src={p.image}
                      alt={p.component.name}
                      fill
                      sizes="(max-width: 640px) 48vw, (max-width: 1024px) 30vw, 280px"
                      className={styles.catImg15}
                    />
                  </span>
                  <span className={styles.catBody15}>
                    <span className={styles.catName15}>
                      {p.component.name}
                      <FiArrowRight aria-hidden className={styles.catArrow15} />
                    </span>
                    <span className={styles.catDesc15}>{p.component.description}</span>
                    {cat && <span className={styles.catCrumb15}>In {cat.name}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
