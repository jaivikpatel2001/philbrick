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
    <section id="industries" className="section">
      <div className="container--wide">
        <SectionHeader
          eyebrow="Industries"
          title="Engineered for every kind of building."
          description="From private residences to hospitals, transit hubs and supertall towers, VERTIQ tailors vertical mobility to the demands of each sector."
        />
        <div className={styles.grid}>
          {INDUSTRIES.map((it, i) => (
            <Link
              key={it.name}
              href="/products"
              className={styles.card}
              data-reveal="up"
              style={{ "--reveal-delay": `${i * 0.05}s` } as React.CSSProperties}
            >
              <Image
                src={it.img}
                alt={it.name}
                fill
                sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw"
                className={styles.img}
              />
              <div className={styles.overlay} />
              <div className={styles.body}>
                <h3 className={styles.name}>{it.name}</h3>
                <p className={styles.tagline}>{it.tagline}</p>
                <span className={styles.cta}>
                  Explore solutions <FiArrowUpRight />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
