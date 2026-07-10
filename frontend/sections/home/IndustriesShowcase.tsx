import Link from "next/link";
import Image from "next/image";
import { FiArrowUpRight } from "react-icons/fi";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { INDUSTRY_IMG } from "@/data/images";
import styles from "./IndustriesShowcase.module.css";

const INDUSTRIES = [
  { name: "Residential", tagline: "Homes, villas & residential towers", img: INDUSTRY_IMG.residential },
  { name: "Commercial", tagline: "Offices, retail & mixed use", img: INDUSTRY_IMG.commercial },
  { name: "Healthcare", tagline: "Hospitals, clinics & critical care", img: INDUSTRY_IMG.healthcare },
  { name: "Hospitality", tagline: "Hotels, resorts & leisure", img: INDUSTRY_IMG.hospitality },
  { name: "Industrial", tagline: "Warehouses, plants & logistics", img: INDUSTRY_IMG.industrial },
];

export function IndustriesShowcase() {
  return (
    <section id="industries" className="section section--flush-bottom">
      <div className="container--wide">
        <SectionHeader
          eyebrow="05 — Industries"
          title="Engineered for every kind of building."
          description="From private residences to hospitals, transit hubs and supertall towers — VERTIQ tailors vertical mobility to the demands of each sector."
        />
      </div>

      {/* Full-bleed panel strip — panels breathe open on hover */}
      <div className={`bleed ${styles.strip}`} data-reveal="fade">
        {INDUSTRIES.map((it, i) => (
          <Link key={it.name} href="/products" className={styles.panel}>
            <Image
              src={it.img}
              alt={it.name}
              fill
              sizes="(max-width: 900px) 78vw, 22vw"
              className={styles.img}
            />
            <span className={styles.shade} aria-hidden />
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <span className={styles.body}>
              <span className={styles.name}>{it.name}</span>
              <span className={styles.tagline}>{it.tagline}</span>
              <span className={styles.cta}>
                Explore solutions <FiArrowUpRight />
              </span>
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
