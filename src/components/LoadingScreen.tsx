export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center" style={{ background: '#0d1b2a' }}>
      <div className="text-[28px] mb-3">🌙</div>
      <div className="text-[15px] font-bold mb-2" style={{ color: '#dce8f5', fontFamily: 'var(--font-mono)' }}>
        Luna's Payroll
      </div>
      <div className="text-xs mb-4" style={{ color: '#4a6278', fontFamily: 'var(--font-mono)' }}>
        Loading saved data…
      </div>
      <div className="flex gap-1.5">
        {[0, 0.2, 0.4].map((delay, i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ background: '#4f8ef7', animationDelay: `${delay}s` }}
          />
        ))}
      </div>
    </div>
  );
}
