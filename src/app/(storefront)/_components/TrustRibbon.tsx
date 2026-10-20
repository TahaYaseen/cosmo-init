const CLAIMS = [
  {
    title: 'Dermatologically Tested',
    text: 'Clinically proven gentle on skin',
    icon: <path d="M12 3l7 3v5c0 4.5-3 8.2-7 10-4-1.8-7-5.5-7-10V6l7-3zM9.5 12l2 2 3.5-4" />,
  },
  {
    title: 'Cruelty Free',
    text: 'Never tested on animals',
    icon: (
      <path d="M12 21s-7-4.4-9-9.2C1.6 8 3.8 5 7 5c2 0 3.4 1 5 3 1.6-2 3-3 5-3 3.2 0 5.4 3 4 6.8-2 4.8-9 9.2-9 9.2z" />
    ),
  },
  {
    title: 'No Synthetic Dyes',
    text: 'Colour only from nature',
    icon: <path d="M12 3c3.5 4 6 6.8 6 10a6 6 0 0 1-12 0c0-3.2 2.5-6 6-10z" />,
  },
  {
    title: 'Transparent Sourcing',
    text: 'Every ingredient, fully traced',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3z" />
      </>
    ),
  },
];

/** Trust-badge row (static marketing content). */
export function TrustRibbon() {
  return (
    <section aria-label="Our promises" className="border-b border-outline-variant">
      <ul className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-8 px-6 py-10 lg:grid-cols-4">
        {CLAIMS.map((c) => (
          <li key={c.title} className="flex flex-col items-center gap-3 text-center">
            <svg
              viewBox="0 0 24 24"
              className="h-7 w-7 fill-none stroke-current"
              strokeWidth={1.25}
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {c.icon}
            </svg>
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.18em]">{c.title}</p>
              <p className="mt-1 text-sm opacity-70">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
