import type { Metadata } from "next";
import { FlaskConical } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { EmptyState } from "@/components/site/empty-state";
import { ProductCard } from "@/components/cards/product-card";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Reveal } from "@/components/site/reveal";
import { LabStatus } from "@/components/lab/lab-status";
import { StatusBadge } from "@/components/site/status-badge";
import { getProducts } from "@/lib/queries/content";
import { getLabMetrics, visibleMetrics } from "@/lib/queries/metrics";
import { PRODUCT_STATUSES, STATUS_META } from "@/config/site";
import { buildMetadata } from "@/lib/seo";
import { breadcrumbSchema, itemListSchema, jsonLdGraph, webPageSchema } from "@/lib/structured-data";

export async function generateMetadata(): Promise<Metadata> {
  return buildMetadata({
    path: "/products",
    title: "Products We've Built — The Inovexa Labs Product Lab",
    description:
      "Software products researched, designed and built inside the Inovexa Labs Product Lab — published with their honest status, technology and progress.",
    keywords: [
      "software products",
      "product development company Nepal",
      "SaaS products",
      "restaurant management system",
    ],
  });
}

export default async function ProductsPage() {
  const [products, metrics] = await Promise.all([getProducts(), getLabMetrics()]);

  // Group by lifecycle stage — the lab's own filing system.
  const byStatus = PRODUCT_STATUSES.map((status) => ({
    status,
    items: products.filter((product) => product.status === status),
  })).filter((group) => group.items.length > 0);

  const stats = visibleMetrics(metrics);

  return (
    <>
      <PageHeader
        trail={[{ name: "Home", path: "/" }, { name: "Products", path: "/products" }]}
        eyebrow="Products we've built"
        title="We don't only build for clients."
        lede="The Product Lab is where Inovexa Labs researches, experiments and builds software we own. Each product below is a real system in a real stage of its life, published with that stage stated plainly."
        meta={
          <>
            <span className="mono-label text-ash">
              {String(products.length).padStart(2, "0")} products
            </span>
            {stats.map((stat) => (
              <span key={stat.label} className="mono-label text-ash-deep">
                {String(stat.value).padStart(2, "0")} {stat.label.toLowerCase()}
              </span>
            ))}
          </>
        }
      />

      {products.length > 0 ? (
        <>
          {byStatus.map((group) => (
            <Section key={group.status} bordered>
              <SectionHeading
                eyebrow={
                  <span className="flex items-center gap-3">
                    <StatusBadge status={group.status} size="sm" />
                    <span className="text-ash-deep">
                      {group.items.length} {group.items.length === 1 ? "product" : "products"}
                    </span>
                  </span>
                }
                title={STATUS_META[group.status].label}
              />
              <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {group.items.map((product, index) => (
                  <Reveal key={product.id} delay={(index % 3) * 80}>
                    <ProductCard product={product} priority={index === 0} />
                  </Reveal>
                ))}
              </div>
            </Section>
          ))}

          <Section bordered>
            <div className="grid gap-12 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] lg:gap-20">
              <div className="max-w-2xl">
                <h2 className="display-md text-bone">How products are filed here.</h2>
                <dl className="mt-10 divide-y divide-steel border-y border-steel">
                  {PRODUCT_STATUSES.map((status) => (
                    <div key={status} className="flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:gap-8">
                      <dt className="w-40 shrink-0">
                        <StatusBadge status={status} pulse={false} />
                      </dt>
                      <dd className="text-sm leading-relaxed text-ash">
                        {STATUS_COPY[status]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
              <div className="lg:sticky lg:top-28 lg:self-start">
                <LabStatus />
              </div>
            </div>
          </Section>
        </>
      ) : (
        <Section>
          <EmptyState
            icon={<FlaskConical className="size-5" />}
            title="The lab is building."
            body="New products will appear here as they move from experiment to launch. We publish a product when there is something real to show — status, technology and progress included."
            action={{ label: "See the experiments", href: "/lab" }}
          />
        </Section>
      )}

      <CtaBand
        eyebrow="Engine 01"
        title="Need something built for you?"
        body="The same engineering that runs our own products is available for yours. Tell us the problem and we will tell you honestly whether it is worth building."
      />

      <JsonLd
        id="products-graph"
        data={jsonLdGraph([
          webPageSchema({
            path: "/products",
            name: "Products We've Built",
            description:
              "Software products built inside the Inovexa Labs Product Lab, published with their current status.",
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
          ]),
          itemListSchema(
            products.map((p) => ({ name: p.name, path: `/products/${p.slug}` })),
            "Inovexa Labs products",
          ),
        ])}
      />
    </>
  );
}

const STATUS_COPY: Record<(typeof PRODUCT_STATUSES)[number], string> = {
  idea: "A problem we believe is worth solving. Nothing built yet — recorded so it does not get lost.",
  experiment:
    "Something is on the bench. We are testing the hardest assumption before committing real engineering time.",
  in_development:
    "The approach held up and this is being built. Progress is published here as it moves.",
  live: "In production and being used. Reachable, supported, and still changing.",
  archived:
    "Retired or paused. Kept visible because a stopped experiment is still a result worth reading.",
};
