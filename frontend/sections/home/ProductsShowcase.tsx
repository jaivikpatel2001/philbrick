import { SectionHeader } from "@/components/ui/SectionHeader";
import { Button } from "@/components/ui/Button";
import { ProductCard } from "@/components/cards/ProductCard";
import { PRODUCTS } from "@/data/products";
import styles from "./ProductsShowcase.module.css";

export function ProductsShowcase() {
  return (
    <section className={`section ${styles.section}`}>
      <div className="container--wide">
        <SectionHeader
          eyebrow="The portfolio"
          title="One platform. Every kind of rise."
          description="From a single home lift to forty-two cars in a supertall, every VERTIQ system shares the same intelligent core."
          action={
            <Button href="/products" variant="ghost" withArrow>
              View all products
            </Button>
          }
        />
        <div className={styles.grid}>
          {PRODUCTS.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
