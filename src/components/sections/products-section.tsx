import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { ProductCard } from "@/components/cards/product-card";
import { Reveal } from "@/components/site/reveal";
import { getFeaturedProducts, getProducts } from "@/lib/queries/content";

/**
 * Products are a first-class section, not portfolio filler. Each one links to a
 * dynamic page carrying its own SEO, status, features and technology surface.
 */
export async function ProductsSection() {
  const [featured, all] = await Promise.all([getFeaturedProducts(), getProducts()]);
  const products = featured.length > 0 ? featured : all.slice(0, 3);

  return (
    <Section id="products" bordered>
      <SectionHeading
        eyebrow="Products we've built"
        title="Software we own end to end."
        lede="The Product Lab is not a slide in a pitch deck. These are real systems we specified, designed, built and operate ourselves — published here with their honest status attached."
        action={{ label: "All products", href: "/products" }}
      />

      <div className="mt-14">
        {products.length > 0 ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product, index) => (
              <Reveal key={product.id} delay={index * 90}>
                <ProductCard product={product} priority={index === 0} />
              </Reveal>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={<FlaskConical className="size-5" />}
            title="The lab is building."
            body="New products will appear here as they move from experiment to launch. We publish them when there is something real to show, not before."
            action={{ label: "See what is in the lab", href: "/lab" }}
          />
        )}
      </div>

      {products.length > 0 && all.length > products.length ? (
        <div className="mt-10">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-signal"
          >
            View all {all.length} products
            <ArrowRight className="size-3 transition-transform duration-400 group-hover:translate-x-1" />
          </Link>
        </div>
      ) : null}
    </Section>
  );
}
