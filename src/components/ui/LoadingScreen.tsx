export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center gap-6 bg-[#0d1b12] text-white">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <div className="absolute h-16 w-16 animate-spin rounded-full border-4 border-white/10 border-t-[#FFB800]" />
        <div className="h-3 w-3 animate-pulse rounded-full bg-[#00C48C]" />
      </div>
      <div className="text-center">
        <h1 className="text-lg font-semibold tracking-wide text-[#FFB800]">Portfolio Park</h1>
        <p className="mt-1 text-sm text-white/50">Loading the experience…</p>
      </div>
    </div>
  );
}
