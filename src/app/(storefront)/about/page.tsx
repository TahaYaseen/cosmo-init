import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Brand & Science — Glowrie',
  description:
    'The Alchemy of Radiance — Glowrie’s story, sourcing philosophy, and the science behind every formulation.',
};

/**
 * Static Brand/About page (UC-004). Content is developer-maintained JSX,
 * not CMS-managed (ADR-007) — sourced from the approved UX design
 * (docs/ux/ux-design-html/visitor/index.html) and the Glowrie "Brand page"
 * mockup/DESIGN.md.
 */
export default function AboutPage() {
  return (
    <>
      <section className="flex min-h-[70vh] flex-col items-center justify-center bg-gradient-to-b from-surface-low to-surface px-4 py-36 text-center md:px-16 md:py-40">
        <div className="mx-auto flex max-w-[760px] flex-col items-center gap-6">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
            Chapter I
          </span>
          <h1 className="font-display text-[56px] leading-none text-on-surface">
            The Alchemy of Radiance
          </h1>
          <p className="text-lg text-on-surface-variant">
            We believe that true luminosity is not manufactured, but meticulously drawn forth.
            Glowrie is a testament to the delicate balance between ancient reverence and modern
            precision.
          </p>
        </div>
      </section>

      <section className="px-4 py-[120px] md:px-16">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-14 md:grid-cols-2 md:gap-20">
          <div className="relative flex aspect-[3/4] items-center justify-center bg-gradient-to-br from-surface-low to-surface-lowest">
            <svg
              width="150"
              height="150"
              viewBox="0 0 64 64"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-outline opacity-50"
              aria-hidden="true"
            >
              <path d="M32 6c8 10 18 18 18 30a18 18 0 1 1-36 0C14 24 24 16 32 6Z" />
            </svg>
          </div>
          <div>
            <span className="mb-5 inline-block border-l border-primary pl-3 text-xs font-semibold uppercase tracking-[0.1em] text-primary">
              Sourcing
            </span>
            <h2 className="mb-6 font-display text-4xl text-on-surface">Rooted in Reverence</h2>
            <p className="mb-4 text-base text-on-surface-variant">
              Our journey begins in untouched enclaves where nature&apos;s most potent elements
              thrive. We approach sourcing not as extraction, but as an exchange — a respectful
              harvesting of wild-foraged botanicals that have absorbed the vitality of their
              environment.
            </p>
            <p className="text-base text-on-surface-variant">
              Each ingredient is selected for its unparalleled purity, ensuring the foundational
              essence of our formulations remains uncompromised and profoundly effective.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-surface-lowest px-4 py-[120px] md:px-16">
        <div className="mx-auto mb-16 flex max-w-[680px] flex-col gap-4 text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">
            Distillation
          </span>
          <h2 className="font-display text-4xl text-on-surface">The Science of Efficacy</h2>
          <p className="text-base text-on-surface-variant">
            Reverence for nature is elevated through uncompromising scientific rigor. Our
            laboratories are sanctuaries of precision, where traditional apothecary wisdom meets
            advanced molecular extraction.
          </p>
        </div>
        <div className="mx-auto grid max-w-[900px] grid-cols-1 gap-12 text-center md:grid-cols-3">
          {[
            { step: '1', title: 'Isolation', description: 'Identifying the active core.' },
            { step: '2', title: 'Refinement', description: 'Purifying for maximum affinity.' },
            { step: '3', title: 'Synergy', description: 'Formulating complete harmony.' },
          ].map((item) => (
            <div key={item.step}>
              <div className="mx-auto mb-5 flex h-9 w-9 items-center justify-center rounded-full border border-primary font-mono text-primary">
                {item.step}
              </div>
              <h3 className="mb-2 font-display text-2xl text-on-surface">{item.title}</h3>
              <p className="font-mono text-sm text-on-surface-variant">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="px-4 py-[120px] text-center">
        <Link
          href="/"
          className="inline-block border border-primary-container px-8 py-4 text-xs font-semibold uppercase tracking-[0.1em] text-on-surface hover:bg-primary-container hover:text-obsidian"
        >
          Return to the Collection
        </Link>
      </div>
    </>
  );
}
