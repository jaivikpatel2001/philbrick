/* =============================================================================
   PRODUCT DETAIL BODY

   Renders whatever the client actually published for a product and nothing
   else — no empty "Specifications" shell for the 19 products that have none:

     photography      always (every product has at least one shot)
     salient features when the WordPress excerpt carried a list
     specifications   when the WordPress body carried tables

   The specification markup comes from the client's own WordPress body,
   sanitised at build time by scripts/generateCatalog.mjs (presentational
   attributes stripped, structure — including rowspan and nested option lists —
   kept verbatim). It is injected because a bespoke parser would risk silently
   dropping merged cells, and the brief is that nothing published is lost.
   The input is a static, trusted, build-time export, never user input.
   ========================================================================== */
import { ProductGallery } from "@/components/products/ProductGallery";
import type { CatalogProduct } from "@/data/catalog";
import styles from "./ProductDetail.module.css";

interface Props {
  product: CatalogProduct;
  /** Short qualitative summary from the product tree. */
  description: string;
  /** Heading level for the product name; h1 on a detail page, h2 when inlined. */
  as?: "h1" | "h2";
  priority?: boolean;
  /** Hide the name when the page hero already shows it. */
  showName?: boolean;
}

export function ProductDetail({
  product,
  description,
  as: Heading = "h2",
  priority = false,
  showName = true,
}: Props) {
  const hasFeatures = product.featureGroups.length > 0;

  /* 19 of the 38 products carry no copy on the client's site. A two-column
     split would leave half the row empty, so those stack: a short intro, then
     the photography at a comfortable reading width. */
  const solo = !hasFeatures;

  return (
    <article className={styles.detail}>
      <div className={`${styles.top} ${solo ? styles.topSolo : ""}`}>
        <div className={styles.media} data-reveal="up">
          <ProductGallery
            images={product.images}
            name={product.name}
            priority={priority}
          />
        </div>

        <div className={styles.info} data-reveal="up">
          {showName && <Heading className={styles.name}>{product.name}</Heading>}
          {description && <p className={styles.lead}>{description}</p>}

          {hasFeatures &&
            product.featureGroups.map((group) => (
              <section key={group.heading || "features"} className={styles.featureBlock}>
                <h3 className={styles.featureHeading}>
                  {group.heading || "Salient features"}
                </h3>
                {group.note && <p className={styles.featureNote}>{group.note}</p>}
                {group.items.length > 0 && (
                  <ul className={styles.featureList}>
                    {group.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
        </div>
      </div>

      {product.specHtml && (
        <section className={styles.specs} data-reveal="up">
          <h3 className={styles.specsHeading}>Models and specifications</h3>
          <div
            className={styles.specsBody}
            dangerouslySetInnerHTML={{ __html: product.specHtml }}
          />
        </section>
      )}
    </article>
  );
}
