import Link from "next/link";
import { FiArrowUpRight, FiChevronsUp } from "react-icons/fi";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { getCategory, categoryHref } from "@/data/products";
import type { ProductNode } from "@/types";
import styles from "./ProductsShowcase.module.css";

/* The elevator "system": six categories orbit a central core to communicate a
   complete component ecosystem (all six carry the story; the full range lives
   at /products). Orbit on desktop, a connected system spine on mobile. */
const ORBIT = [
  "elevator-control-panel",
  "elevator-display",
  "synergy-auto-door",
  "elevator-iot",
  "ard",
  "integrated-control-panel",
];

export function ProductsShowcase() {
  const nodes = ORBIT.map((slug) => getCategory(slug)).filter(Boolean) as ProductNode[];

  return (
    <section className={`section ${styles.section}`}>
      <div className="container--wide">
        <SectionHeader
          eyebrow="02 The range"
          title="Everything an elevator needs."
          description="Control, safety, doors, cabins and signalling: Philbrick engineers and builds the components that make a lift run, all under one roof."
          action={
            <Button href="/products" variant="ghost" withArrow>
              All products
            </Button>
          }
        />

        <div
          className={styles.stage}
          style={{ "--count": nodes.length } as React.CSSProperties}
        >
          {/* Central system core. The wrapper owns the centering transform so
             the reveal's transform on .core can't knock it off the orbit axis. */}
          <div className={styles.coreWrap}>
            <div className={styles.core} data-reveal="scale">
              <span className={styles.coreIcon} aria-hidden>
                <FiChevronsUp />
              </span>
              <span className={styles.coreLabel}>The Philbrick system</span>
              <span className={styles.coreSub}>Every component, one source</span>
            </div>
          </div>

          {/* Orbiting category nodes */}
          <ul className={styles.orbit} role="list">
            {nodes.map((node, i) => (
              <li
                key={node.slug}
                className={styles.nodeItem}
                style={{ "--i": i } as React.CSSProperties}
              >
                {/* Counter-rotates against the ring so the card stays upright. */}
                <span className={styles.nodeSpin}>
                  <Link
                    href={categoryHref(node.slug)}
                    className={styles.node}
                    data-reveal="scale"
                    style={{ "--reveal-delay": `${0.15 + i * 0.08}s` } as React.CSSProperties}
                  >
                    <span className={styles.nodeGroup}>{node.category}</span>
                    <span className={styles.nodeName}>
                      {node.name}
                      <FiArrowUpRight className={styles.nodeArrow} aria-hidden />
                    </span>
                  </Link>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
