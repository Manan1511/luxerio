import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { storefrontQuery } from '../lib/shopify/client.js';
import { CATEGORY_OPTIONS, CATEGORY_TAG_MAP } from '../lib/shopify/filters.js';
import { shopifyImg, markLoaded, onImgLoad } from '../lib/shopify/image.js';

/*
  Pronk-style circular category row. Thumbnail = featured image of the first
  product in each category, fetched in ONE aliased query. No manual assets.
  Guards against CATEGORY_OPTIONS/CATEGORY_TAG_MAP drifting out of sync —
  without this a stray category would silently query tag:"undefined".
*/
const CATS = CATEGORY_OPTIONS.filter((c) => c.value !== '' && CATEGORY_TAG_MAP[c.value]);

const THUMBS_QUERY = /* GraphQL */ `
  query CategoryThumbs {
    ${CATS.map((c, i) => {
      const tag = CATEGORY_TAG_MAP[c.value];
      const q = JSON.stringify(`tag:${JSON.stringify(tag)}`);
      return `c${i}: products(first: 1, query: ${q}) { edges { node { featuredImage { url altText } } } }`;
    }).join('\n')}
  }
`;

export default function StoryBubbles() {
  const { data, isLoading } = useQuery({
    queryKey: ['category-thumbs'],
    queryFn: () => storefrontQuery(THUMBS_QUERY),
    staleTime: 1000 * 60 * 30,
  });

  return (
    <section aria-label="Shop by category" className="border-b border-hairline">
      <div className="mx-auto flex max-w-[1280px] gap-6 overflow-x-auto px-6 py-6 lg:justify-center lg:px-16 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {CATS.map((cat, i) => {
          const img = data?.[`c${i}`]?.edges?.[0]?.node?.featuredImage;
          return (
            <Link
              key={cat.value}
              to={`/shop?categories=${cat.value}`}
              className="group flex w-20 shrink-0 snap-start flex-col items-center gap-2.5"
            >
              <span className="grid h-20 w-20 place-items-center overflow-hidden rounded-full border border-hairline bg-elevated transition-colors group-hover:border-primary">
                {isLoading ? (
                  <span className="h-full w-full animate-pulse rounded-full bg-hairline" aria-hidden="true" />
                ) : (
                  img && (
                    <img
                      src={shopifyImg(img.url, 160)}
                      alt=""
                      aria-hidden="true"
                      loading="lazy"
                      decoding="async"
                      ref={markLoaded}
                      onLoad={onImgLoad}
                      className="img-fade h-full w-full rounded-full object-cover"
                    />
                  )
                )}
              </span>
              <span className="text-center font-display text-[10px] font-medium uppercase tracking-[0.12em] leading-tight text-primary">
                {cat.label}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
