import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { PageHeader } from "@/components/site/page-header";
import { Section, SectionHeading } from "@/components/site/section";
import { StatusBadge } from "@/components/site/status-badge";
import { ServiceIcon } from "@/components/cards/service-icon";
import { ProductCard } from "@/components/cards/product-card";
import { CtaBand } from "@/components/site/cta-band";
import { JsonLd } from "@/components/site/json-ld";
import { Markdown } from "@/components/content/markdown";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/site/reveal";
import {
  getProductBySlug,
  getProductFeatures,
  getProducts,
} from "@/lib/queries/content";
import { formatDate, initials, toStringArray } from "@/lib/utils";
import { buildMetadata } from "@/lib/seo";
import {
  breadcrumbSchema,
  jsonLdGraph,
  softwareApplicationSchema,
  webPageSchema,
} from "@/lib/structured-data";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return buildMetadata({ path: `/products/${slug}`, robots: "noindex,nofollow" });

  return buildMetadata({
    path: `/products/${product.slug}`,
    title: product.seo_title || `${product.name} — ${product.tagline}`,
    description: product.seo_description || product.short_description || product.tagline,
    keywords: product.seo_keywords,
    canonicalOverride: product.canonical_url,
    ogTitle: product.og_title,
    ogDescription: product.og_description,
    ogImage: product.og_image_url || product.cover_image_url,
    robots: product.robots,
  });
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProductBySlug(slug), getProducts()]);
  if (!product) notFound();

  const features = await getProductFeatures(product.id);
  const others = all.filter((p) => p.slug !== product.slug).slice(0, 3);
  const gallery = toStringArray(product.gallery);
  const technologies = toStringArray(product.technologies);
  const path = `/products/${product.slug}`;

  return (
    <>
      <PageHeader
        trail={[
          { name: "Home", path: "/" },
          { name: "Products", path: "/products" },
          { name: product.name, path },
        ]}
        eyebrow={
          <span className="flex flex-wrap items-center gap-3">
            <StatusBadge status={product.status} />
            {product.category ? <span className="text-ash-deep">{product.category}</span> : null}
          </span>
        }
        title={product.name}
        lede={product.short_description ?? product.tagline}
        meta={
          <>
            {product.logo_url ? (
              <Image
                src={product.logo_url}
                alt=""
                width={40}
                height={40}
                className="size-10 rounded-xl border border-steel object-cover"
              />
            ) : (
              <span
                aria-hidden
                className="flex size-11 items-center justify-center rounded-xl border border-steel bg-graphite font-display text-base font-semibold text-bone-dim"
              >
                {initials(product.name)}
              </span>
            )}
            <span className="mono-label text-bone-dim">{product.tagline}</span>
            {product.launch_date ? (
              <span className="mono-label text-ash-deep">
                Launched {formatDate(product.launch_date)}
              </span>
            ) : null}
            <span className="mono-label text-ash-deep">
              Updated {formatDate(product.updated_at)}
            </span>
            {product.product_url ? (
              <a
                href={product.product_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 font-mono text-[0.6875rem] uppercase tracking-[0.14em] text-signal underline-offset-4 hover:underline"
              >
                Visit product
                <ExternalLink className="size-3" />
              </a>
            ) : null}
          </>
        }
      />

      {/* Hero media, or a generated mark when no screenshot exists yet. */}
      <div className="mx-auto w-full max-w-[86rem] edge-x pt-14">
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-graphite">
          {product.cover_image_url ? (
            <Image
              src={product.cover_image_url}
              alt={`${product.name} interface`}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
              <div aria-hidden className="lab-grid-fine absolute inset-0 opacity-70" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-signal/[0.045] via-transparent to-plasma/[0.04]" />
              <span className="relative flex size-20 items-center justify-center rounded-2xl border border-steel bg-carbon font-display text-2xl font-semibold text-bone-dim">
                {initials(product.name)}
              </span>
              <p className="relative mono-label text-ash-deep">
                Screenshots publish when there is something to show
              </p>
            </div>
          )}
        </div>
      </div>

      <Section>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:gap-20">
          <div>
            {product.full_description ? (
              <Markdown content={product.full_description} />
            ) : (
              <p className="text-base leading-relaxed text-bone-dim">{product.tagline}</p>
            )}

            {features.length > 0 ? (
              <div className="mt-16">
                <h2 className="display-md text-bone">What it does.</h2>
                <ul className="mt-10 grid gap-px overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-steel sm:grid-cols-2">
                  {features.map((feature) => (
                    <li key={feature.id} className="bg-carbon p-5">
                      <span className="flex size-9 items-center justify-center rounded-lg border border-steel bg-graphite text-signal">
                        <ServiceIcon name={feature.icon} />
                      </span>
                      <h3 className="mt-4 font-display text-base font-medium tracking-tight text-bone">
                        {feature.title}
                      </h3>
                      {feature.description ? (
                        <p className="mt-2 text-sm leading-relaxed text-ash">{feature.description}</p>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {gallery.length > 0 ? (
              <div className="mt-16">
                <h2 className="display-md text-bone">Screenshots.</h2>
                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {gallery.map((src, index) => (
                    <div
                      key={src}
                      className="relative aspect-[4/3] overflow-hidden rounded-xl border border-steel bg-graphite"
                    >
                      <Image
                        src={src}
                        alt={`${product.name} screenshot ${index + 1}`}
                        fill
                        sizes="(min-width: 640px) 50vw, 100vw"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {product.video_url ? (
              <div className="mt-16">
                <h2 className="display-md text-bone">Walkthrough.</h2>
                <div className="mt-8 aspect-video overflow-hidden rounded-[var(--radius-panel)] border border-steel bg-carbon">
                  <iframe
                    src={product.video_url}
                    title={`${product.name} walkthrough`}
                    loading="lazy"
                    allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="size-full"
                  />
                </div>
              </div>
            ) : null}
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <dl className="panel divide-y divide-steel overflow-hidden">
              <Spec label="Status">
                <StatusBadge status={product.status} size="sm" />
              </Spec>
              {product.category ? <Spec label="Category">{product.category}</Spec> : null}
              <Spec label="Stage note">
                <span className="text-right">{product.last_updated_note ?? "—"}</span>
              </Spec>
              {product.launch_date ? (
                <Spec label="Launched">{formatDate(product.launch_date)}</Spec>
              ) : null}
              <Spec label="Last updated">{formatDate(product.updated_at)}</Spec>
              {product.is_open_source ? <Spec label="Open source">Yes</Spec> : null}
            </dl>

            {technologies.length > 0 ? (
              <div className="panel mt-5 p-6">
                <h2 className="mono-label text-ash-deep">Stack</h2>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {technologies.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full border border-steel bg-graphite px-3 py-1.5 font-mono text-[0.625rem] uppercase tracking-[0.12em] text-bone-dim"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="panel mt-5 p-6">
              <h2 className="mono-label text-ash-deep">Built by the lab</h2>
              <p className="mt-4 text-sm leading-relaxed text-ash">
                {product.name} is an Inovexa Labs product. We specified it, designed it and
                build it ourselves — which is exactly the engineering we bring to client work.
              </p>
              <Button asChild variant="secondary" className="mt-5 w-full">
                <Link href="/contact">
                  Work with us
                  <ArrowUpRight className="size-4" />
                </Link>
              </Button>
            </div>
          </aside>
        </div>
      </Section>

      {others.length > 0 ? (
        <Section bordered>
          <SectionHeading
            eyebrow="Also in the lab"
            title="Other products."
            action={{ label: "All products", href: "/products" }}
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((item, index) => (
              <Reveal key={item.id} delay={index * 80}>
                <ProductCard product={item} />
              </Reveal>
            ))}
          </div>
        </Section>
      ) : null}

      <CtaBand />

      <JsonLd
        id={`product-${product.slug}-graph`}
        data={jsonLdGraph([
          // SoftwareApplication schema is emitted only for products that are
          // genuinely software in development or live — never for an idea.
          softwareApplicationSchema(product),
          webPageSchema({
            path,
            name: product.name,
            description: product.short_description ?? product.tagline,
          }),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Products", path: "/products" },
            { name: product.name, path },
          ]),
        ])}
      />
    </>
  );
}

function Spec({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <dt className="mono-label text-ash-deep">{label}</dt>
      <dd className="text-right text-sm text-bone-dim">{children}</dd>
    </div>
  );
}
