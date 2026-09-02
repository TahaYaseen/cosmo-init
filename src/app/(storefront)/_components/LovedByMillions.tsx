import Image from 'next/image';

export interface LovedByMillionsFeature {
  title: string;
  description: string;
}

const FEATURES: LovedByMillionsFeature[] = [
  {
    title: 'Dermatologist Recommended',
    description: 'Formulated with pure, active ingredients at optimal pH levels.',
  },
  {
    title: 'Clinically Proven Efficacy',
    description: 'Visible reduction in blemishes within 72 hours of targeted use.',
  },
  {
    title: 'Best-Selling Formula',
    description: 'Trusted by millions to deliver clear, glowing skin daily.',
  },
];

/**
 * "We're Loved By Millions!" social-proof section (static marketing content,
 * not CMS-managed, per ADR-007's spirit for non-Product content — same
 * pattern as HeroCarousel/TrustRibbon).
 *
 * Source: docs/bug-fix-scope.md Root Cause 6 — present in the original
 * source mockup (`home page/code.html:394-429`) but dropped before the UX
 * Design prototype/sign-off and never implemented. Copy is verbatim from
 * that mockup.
 *
 * The mockup's supporting image used a temporary `lh3.googleusercontent.com`
 * placeholder URL, which is not a committed project asset. A real brand
 * photo was not available at implementation time, so this ships with a
 * stock-style placeholder (`public/images/loved-by-millions.jpg`) using the
 * same picsum.photos-sourced placeholder convention already established by
 * this project's seeded product images
 * (supabase/migrations/20260823000004_seed_products.sql). Replace with a
 * real, licensed "three people holding Glowrie products" photo when one is
 * available.
 *
 * The mockup's "Read Clinical Studies" link used a bare `href="#"`
 * placeholder with no real destination specified. Per the fix instructions
 * (docs/bug-fix-scope.md Root Cause 6, item 1), no destination URL was
 * invented — this ships as a non-navigating placeholder anchor pending a
 * real clinical-studies page/PDF from the product/marketing owner.
 */
export function LovedByMillions() {
  return (
    <section
      className="px-4 py-[120px] md:px-16"
      id="loved-by-millions"
      aria-labelledby="loved-by-millions-heading"
    >
      <div className="mx-auto grid max-w-[1200px] grid-cols-1 items-center gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <h2
            id="loved-by-millions-heading"
            className="font-display text-4xl text-on-surface"
          >
            We&apos;re Loved By Millions!
          </h2>
          <p className="text-lg text-on-surface-variant">
            There&apos;s a reason everybody loves Glowrie: IT WORKS! Our clinical formulas are
            rigorously tested and dermatologist-recommended for visible results.
          </p>

          <ul className="mt-4 flex flex-col gap-6">
            {FEATURES.map((feature) => (
              <li key={feature.title} className="flex items-start gap-4">
                <FeatureIcon />
                <div className="flex flex-col gap-1">
                  <h3 className="font-display text-lg text-on-surface">{feature.title}</h3>
                  <p className="text-base text-on-surface-variant">{feature.description}</p>
                </div>
              </li>
            ))}
          </ul>

          <a
            href="#"
            className="mt-2 inline-flex w-max items-center gap-2 border-b border-obsidian pb-1 text-sm font-semibold uppercase tracking-[0.1em] text-obsidian hover:text-secondary"
          >
            Read Clinical Studies
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="relative aspect-[6/5] w-full overflow-hidden bg-surface-low">
          <Image
            src="/images/loved-by-millions.jpg"
            alt="Three people holding Glowrie products in a retail setting"
            fill
            className="object-cover"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}

function FeatureIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="mt-1 shrink-0 text-outline"
      aria-hidden="true"
    >
      <path d="M9 12l2 2 4-4" />
      <circle cx="12" cy="12" r="10" />
    </svg>
  );
}
