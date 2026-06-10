export function LoadingOverlay() {
  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-[#0b1d2a]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white/80" />
      <p className="text-sm text-white/60">Charting Kauaʻi…</p>
    </div>
  );
}
