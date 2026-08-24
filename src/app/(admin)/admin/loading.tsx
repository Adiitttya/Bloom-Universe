export default function AdminLoading() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Banner Skeleton */}
      <div className="h-40 w-full rounded-[2.5rem] bg-slate-200/80" />

      {/* Modules Skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-48 rounded-xl bg-slate-200" />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-3xl bg-slate-200/70" />
          ))}
        </div>
      </div>

      {/* Log Feed Skeleton */}
      <div className="h-64 rounded-3xl bg-slate-200/70" />
    </div>
  );
}
