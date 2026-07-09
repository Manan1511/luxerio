/*
  Black announcement bar — pronk-style. Scrolling marquee, single editable line.
  Client supplies final copy; edit ANNOUNCEMENT_TEXT only.
*/
export const ANNOUNCEMENT_TEXT = 'Early Bird Sale';

const REPEAT_COUNT = 12;

function MarqueeTrack() {
  return (
    <div className="flex shrink-0 items-center">
      {Array.from({ length: REPEAT_COUNT }).map((_, i) => (
        <span key={i} className="flex items-center">
          <span className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
            {ANNOUNCEMENT_TEXT}
          </span>
          <span className="mx-6 text-white/40">•</span>
        </span>
      ))}
    </div>
  );
}

export default function AnnouncementBar() {
  return (
    <div className="overflow-hidden bg-black py-2">
      <div className="marquee-track flex w-max">
        <MarqueeTrack />
        <MarqueeTrack />
      </div>
      <style>{`
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0%); }
        }
        .marquee-track {
          animation: marquee-right 22s linear infinite;
        }
      `}</style>
    </div>
  );
}
