import type { Testimonial } from "@/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { TestimonialsCarousel } from "./TestimonialsCarousel";

export function TestimonialsSection({
  eyebrow = "Client voices",
  title = "Trusted where it matters most",
  description = "From supertall towers to critical-care hospitals, the world's most demanding buildings run on VERTIQ.",
  testimonials,
}: {
  eyebrow?: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  testimonials: Testimonial[];
}) {
  return (
    <section className="section">
      <div className="container--wide">
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          align="center"
        />
        <TestimonialsCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}
