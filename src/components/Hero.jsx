import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { trackEvent, EVENTS } from '../lib/analytics/ga4.js';

/*
  Hero copy — client-editable constants, same pattern as AnnouncementBar's
  ANNOUNCEMENT_TEXT. Heading is two lines by design (see the <br/> below).
*/
export const HERO_EYEBROW = 'New Drop / FW25';
export const HERO_HEADING_LINE_1 = 'New Season';
export const HERO_HEADING_LINE_2 = 'Essentials';
export const HERO_CTA_LABEL = 'Shop Now';

export default function Hero({ heroBg }) {
  const handleCta = () => {
    trackEvent(EVENTS.SELECT_PROMOTION, {
      promotion_name: 'hero_new_drop',
      creative_slot: 'hero',
    });
  };

  return (
    <section
      className={`relative min-h-[60vh] w-full overflow-hidden bg-cover bg-center ${heroBg ? '' : 'bg-[#0a0a0a]'}`}
      style={heroBg ? { backgroundImage: `url(${heroBg})` } : undefined}
    >
      {/* Scrim for text legibility over photo — no-op visually when there's no
          image, since the fallback bg above is already dark enough for white text. */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex min-h-[60vh] flex-col items-start justify-end px-6 pb-14 lg:px-16">
        <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
          {HERO_EYEBROW}
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-semibold uppercase tracking-[0.06em] text-white md:text-6xl">
          {HERO_HEADING_LINE_1}
          <br />
          {HERO_HEADING_LINE_2}
        </h1>
        <div className="mt-7">
          <Link
            to="/shop"
            onClick={handleCta}
            className="inline-flex items-center gap-3 bg-white px-7 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-85 active:scale-[0.98]"
          >
            {HERO_CTA_LABEL}
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
