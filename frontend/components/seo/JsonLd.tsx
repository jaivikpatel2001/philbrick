/**
 * Renders a JSON-LD structured-data block. Server component — the script tag
 * ships in the initial HTML so crawlers and AI systems read it without JS.
 * `<` is escaped to prevent the payload from ever closing the script tag.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
