export default function AdminServicesLoading() {
  return (
    <div role="status" aria-label="Loading services" className="animate-pulse">
      <div className="mb-8 space-y-3">
        <div className="h-9 w-48 rounded-md bg-fg/[0.07]" />
        <div className="h-5 w-96 max-w-full rounded-md bg-fg/[0.05]" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} className="h-18 rounded-lg border border-line bg-surface" />
        ))}
      </div>
    </div>
  );
}
