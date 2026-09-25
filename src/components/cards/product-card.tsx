import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { StatusBadge } from "@/components/site/status-badge";
import { initials, formatDate } from "@/lib/utils";
import type { Product } from "@/types/content";

/**
 * Products are presented as lab artefacts, not portfolio pieces: status first,
 * name large, technology surface visible. A product without cover art renders a
 * generated mark rather than a stock illustration.
 */
export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  return (
    <Link
      href={`/products/${product.slug}`}
      className="panel panel-interactive group flex h-full flex-col overflow-hidden"
    >
      <div className="relative aspect-[16/10] overflow-hidden border-b border-steel bg-graphite">
        {product.cover_image_url ? (
          <Image
            src={product.cover_image_url}
            alt={`${product.name} — ${product.tagline}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
            priority={priority}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div aria-hidden className="lab-grid-fine absolute inset-0 opacity-60" />
            <span className="relative flex size-16 items-center justify-center rounded-2xl border border-steel bg-carbon font-display text-xl font-semibold tracking-tight text-bone-dim transition-colors duration-500 group-hover:border-signal/40 group-hover:text-signal">
              {initials(product.name)}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3">
          <StatusBadge status={product.status} />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl font-medium tracking-tight text-bone">
            {product.name}
          </h3>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-ash-deep transition-all duration-400 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-signal" />
        </div>

        <p className="mono-label mt-1.5 text-signal">{product.tagline}</p>

        {product.short_description ? (
          <p className="mt-3.5 line-clamp-3 text-sm leading-relaxed text-ash">
            {product.short_description}
          </p>
        ) : null}

        <div className="mt-auto pt-5">
          {product.technologies?.length ? (
            <ul className="flex flex-wrap gap-1.5">
              {product.technologies.slice(0, 4).map((tech) => (
                <li
                  key={tech}
                  className="rounded border border-steel bg-carbon px-2 py-1 font-mono text-[0.5625rem] uppercase tracking-[0.12em] text-ash"
                >
                  {tech}
                </li>
              ))}
            </ul>
          ) : null}
          <p className="mt-4 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-ash-deep">
            {product.launch_date
              ? `Launched ${formatDate(product.launch_date)}`
              : (product.last_updated_note ?? `Updated ${formatDate(product.updated_at)}`)}
          </p>
        </div>
      </div>
    </Link>
  );
}
