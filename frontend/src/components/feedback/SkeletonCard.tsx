export const SkeletonCard = () => (
  <div className="w-full bg-surface-container-low border border-outline-variant/10 rounded-xl p-5 flex items-center justify-between animate-pulse">
    <div className="flex items-center gap-4 flex-1">
      <div className="w-6 h-6 rounded-full bg-surface-container-highest"></div>
      <div className="space-y-2 flex-1 max-w-md">
        <div className="h-5 w-2/3 bg-surface-container-highest rounded"></div>
        <div className="h-4 w-1/2 bg-surface-container-highest rounded opacity-50"></div>
      </div>
    </div>
    <div className="hidden md:flex items-center gap-6">
      <div className="h-6 w-20 bg-surface-container-highest rounded-full"></div>
      <div className="h-5 w-24 bg-surface-container-highest rounded"></div>
    </div>
  </div>
);
