const CLAIMS = [
  'Dermatologically Tested',
  'Cruelty Free',
  'No Synthetic Dyes',
  'Transparent Sourcing',
];

/** Scrolling trust-badge marquee ribbon (static marketing content). */
export function TrustRibbon() {
  const items = [...CLAIMS, ...CLAIMS];
  return (
    <div className="overflow-hidden border-y border-outline-variant bg-obsidian py-5">
      <div className="flex w-max animate-[ribbon-scroll_24s_linear_infinite] gap-12 whitespace-nowrap text-white">
        {items.map((claim, i) => (
          <span key={i} className="font-mono text-sm uppercase tracking-[0.15em]">
            {claim} {i < items.length - 1 ? '•' : ''}
          </span>
        ))}
      </div>
      <style>{`
        @keyframes ribbon-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
