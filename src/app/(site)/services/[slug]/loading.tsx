export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-[86rem] edge-x pb-24 pt-32">
      <div className="h-3 w-48 animate-pulse rounded-full bg-steel" />
      <div className="mt-10 h-4 w-28 animate-pulse rounded-full bg-steel/70" />
      <div className="mt-6 h-12 w-full max-w-2xl animate-pulse rounded-2xl bg-steel/80" />
      <div className="mt-5 h-4 w-full max-w-xl animate-pulse rounded-full bg-steel/60" />
      <div className="mt-16 grid gap-14 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="space-y-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-4 animate-pulse rounded-full bg-steel/50" style={{ width: `${70 + ((i * 7) % 30)}%` }} />
          ))}
        </div>
        <div className="panel h-72 animate-pulse" />
      </div>
      <span className="sr-only">Loading service…</span>
    </div>
  );
}
