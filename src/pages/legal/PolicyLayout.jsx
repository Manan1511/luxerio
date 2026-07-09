/*
  Shared shell for legal/policy pages — consistent header + readable prose
  body (font-sans, not the display font, since these are read, not skimmed).
*/
export default function PolicyLayout({ title, updated, children }) {
  return (
    <div className="mx-auto max-w-[820px] px-6 py-10 lg:px-16">
      <div className="mb-10 border-b border-hairline pb-6">
        <h1 className="font-display text-4xl font-semibold uppercase tracking-[0.1em] text-primary md:text-5xl">
          {title}
        </h1>
        {updated && (
          <p className="mt-2 font-display text-[10px] uppercase tracking-widest text-secondary">
            Last updated: {updated}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-8 font-sans text-sm leading-relaxed text-primary">
        {children}
      </div>
    </div>
  );
}

export function Section({ heading, children }) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-sm font-semibold uppercase tracking-widest text-primary">
        {heading}
      </h2>
      <div className="flex flex-col gap-3 text-secondary">
        {children}
      </div>
    </section>
  );
}
