# Pronk-Reference Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Restyle Vancito.co from dark neo-industrial/acid-green to pronk.in-style light minimal streetwear, add MEN/WOMEN/ACCESSORIES dropdown nav, story-bubble row, sale pricing on cards, and a Buy Now button.

**Architecture:** Restyle in place. The whole site reads colors from CSS variables in `src/index.css` exposed as Tailwind aliases (`acid`, `base`, `surface`, `elevated`, `primary`, `secondary`, `hairline`). Task 1 repoints those tokens (acid → monochrome accent), which instantly de-greens all 27 component files; later tasks rework layout/typography of specific surfaces and add new components. No data-layer or backend logic changes except additive query fields and one new Buy Now mutation call.

**Tech Stack:** React 18 + Vite 5, Tailwind v3 (`darkMode: 'class'`), TanStack Query, Shopify Storefront API 2024-10 via `graphql-request`, `@phosphor-icons/react`, `motion/react`.

**Verification model:** Repo has no test framework; styling work is verified with grep assertions plus the running dev server (`preview_start` name: `luxerio-dev`, http://localhost:5173). Each task ends with a browser check and a commit. Store password for checkout pages: `mayghu` (dev store).

**Spec:** `docs/superpowers/specs/2026-07-08-pronk-redesign-design.md`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `src/index.css` | Modify | Token values (light/dark), sale red, scrollbar |
| `tailwind.config.js` | Modify | Add `sale` color alias |
| `src/components/AnnouncementBar.jsx` | Create | Black offer bar (replaces GreenStrip) |
| `src/components/GreenStrip.jsx` | Delete | Obsolete acid ticker |
| `src/components/Layout.jsx` | Modify | Swap strip, reorder above Nav |
| `src/components/Nav.jsx` | Rewrite | Dropdown nav + mobile accordions |
| `src/lib/shopify/filters.js` | Modify | Export CATEGORY_TAG_MAP |
| `src/lib/shopify/queries.js` | Modify | Add `createdAt`, `compareAtPriceRange` |
| `src/components/ProductCard.jsx` | Modify | New Arrival badge, sale pricing |
| `src/components/StoryBubbles.jsx` | Create | Circular category row |
| `src/components/Hero.jsx` | Rewrite | 60vh light banner |
| `src/components/FeaturedProducts.jsx` | Modify | BEST SELLERS centered header |
| `src/components/CategoryBento.jsx` | Modify | New tiles/labels for real categories |
| `src/pages/Home.jsx` | Modify | Section order incl. StoryBubbles |
| `src/pages/Product.jsx` | Modify | BUY NOW button + handler |
| ~15 other components | Sweep | `text-black`-on-acid fixes, `font-black` softening |

---

### Task 1: Token flip — kill acid green, light default, sale red

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

- [ ] **Step 1: Replace the token block in `src/index.css`**

Replace lines 5–32 (the comment + `:root` + `.dark` blocks) with:

```css
/*
  Token system — pronk-style monochrome.
  - `--brand-acid` is the legacy accent alias: now monochrome (near-black in
    light, white in dark) so every existing `text-acid`/`bg-acid` usage renders
    as pronk-style black/white without touching 27 files.
  - Gold stays logo-only. Red is for sale pricing only.
  - Semantic tokens flip via the `.dark` class on <html>.
*/
:root {
  --brand-acid: #111111;   /* legacy accent alias — monochrome now */
  --brand-gold: #c9a227;   /* logo mark accent only */
  --sale-red: #e53935;     /* sale price + Save % only */

  /* Light mode (default) — pronk white minimal. */
  --bg-base: #ffffff;
  --bg-surface: #fafafa;
  --bg-elevated: #f0f0f0;
  --text-primary: #111111;
  --text-secondary: #6b6b6b;
  --border-hairline: rgba(0, 0, 0, 0.08);
}

.dark {
  --brand-acid: #f5f5f5;
  --bg-base: #0f0f0f;
  --bg-surface: #171717;
  --bg-elevated: #1f1f1f;
  --text-primary: #f5f5f5;
  --text-secondary: #9a9a9a;
  --border-hairline: rgba(255, 255, 255, 0.1);
}
```

- [ ] **Step 2: Fix scrollbar colors in `src/index.css`**

Replace every `var(--brand-acid)` inside the scrollbar rules (three occurrences: `::-webkit-scrollbar-thumb`, its `:hover`, and `scrollbar-color`) with `var(--text-secondary)`. Also update the comment `/* Scrollbar styling — matches dark design language */` to `/* Scrollbar styling */`.

- [ ] **Step 3: Add `sale` color to `tailwind.config.js`**

In the `colors` block after `gold: 'var(--brand-gold)',` add:

```js
        sale: 'var(--sale-red)',
```

- [ ] **Step 4: Default theme — verify light is default for new visitors**

Open `src/context/ThemeContext.jsx`, find `getInitialTheme()`. If it defaults to `'dark'` when no `localStorage` value and no system preference exists, change that fallback to `'light'`. Also check `index.html` line 2: `<html lang="en" class="dark">` — remove ` class="dark"` so the first paint is light (ThemeContext re-applies the stored choice on mount).

- [ ] **Step 5: Visual check**

Run the dev server (`preview_start` → `luxerio-dev`), open http://localhost:5173. Expected: white page, black text, no green anywhere (prices/links previously acid now near-black). Toggle theme: dark inverts. Green may still appear as `bg-acid text-black` pairs rendering black-on-black — Task 2 fixes those; note them, don't fix here.

- [ ] **Step 6: Commit**

```bash
git add src/index.css tailwind.config.js src/context/ThemeContext.jsx index.html
git commit -m "feat(redesign): monochrome token flip, light default, sale red"
```

---

### Task 2: Class sweep — fix black-on-black pairs, soften brutalist type

With acid now near-black in light mode, any `bg-acid` + `text-black` combo renders black-on-black. Sweep them to `bg-primary text-base` (black bg/white text in light; white bg/black text in dark — pronk button style).

**Files:** all `src/**/*.jsx` (mechanical sweep)

- [ ] **Step 1: List every affected line**

Run: `grep -rn "text-black" src --include="*.jsx"`

Expected ~20 hits across Nav, Hero, ProductCard, FilterRail, VariantSelector, AuthModal, OrderSummary, Product, FeaturedProducts, CategoryBento, Categories, GreenStrip, Account tabs, SearchModal, Cart, StylingTips, ErrorBoundary, PagePlaceholder.

- [ ] **Step 2: Apply replacements in each listed file**

Apply these string replacements (exact, all occurrences, every file from Step 1):

| Old | New |
|---|---|
| `bg-acid text-black` | `bg-primary text-base` |
| `bg-acid px-1 text-[10px] font-bold text-black` | `bg-primary px-1 text-[10px] font-bold text-base` |
| `hover:bg-acid hover:text-black` | `hover:bg-primary hover:text-base` (when already on `bg-primary text-base` button: use `hover:opacity-80` instead) |
| `border-acid bg-acid text-black` | `border-primary bg-primary text-base` |
| `stroke="black"` inside FilterRail checkbox svg | `stroke="var(--bg-base)"` |
| `text-black/40` (GreenStrip only) | skip — file is deleted in Task 3 |

Any remaining `text-black` sitting on an acid/primary background → `text-base`. `text-black` on a white/photo background (e.g. badge chips over images) may stay if contrast is intact — judge per instance; over photos prefer `bg-primary text-base` chips.

- [ ] **Step 3: Verify no black-on-black remains**

Run: `grep -rn "bg-acid text-black\|bg-acid.*text-black" src --include="*.jsx"`
Expected: no matches.

- [ ] **Step 4: Soften headline weight globally**

Run: `grep -rln "font-black" src --include="*.jsx"` then in every file replace `font-black` → `font-semibold`. (Heading scale/tracking gets tuned per-surface in later tasks; this sweep only drops the 900 weight.)

- [ ] **Step 5: Browser check**

Reload preview. Expected: buttons render black with white text (light mode), size pills black when selected, no invisible text anywhere. Dark mode: white buttons, black text.

- [ ] **Step 6: Commit**

```bash
git add src
git commit -m "feat(redesign): monochrome button pairs, soften heading weight"
```

---

### Task 3: AnnouncementBar replaces GreenStrip

**Files:**
- Create: `src/components/AnnouncementBar.jsx`
- Modify: `src/components/Layout.jsx`
- Delete: `src/components/GreenStrip.jsx`

- [ ] **Step 1: Create `src/components/AnnouncementBar.jsx`**

```jsx
/*
  Black announcement bar — pronk-style. Single editable line.
  Client supplies final copy; edit ANNOUNCEMENT_TEXT only.
*/
export const ANNOUNCEMENT_TEXT = 'Get flat 5% off on prepaid orders';

export default function AnnouncementBar() {
  return (
    <div className="bg-black py-2 text-center">
      <p className="font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-white">
        {ANNOUNCEMENT_TEXT}
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Rewrite `src/components/Layout.jsx`**

Bar sits ABOVE the header (pronk order):

```jsx
import Nav from './Nav.jsx';
import Footer from './Footer.jsx';
import AnnouncementBar from './AnnouncementBar.jsx';

export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-base text-primary">
      <AnnouncementBar />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
```

- [ ] **Step 3: Delete the old strip**

```bash
git rm src/components/GreenStrip.jsx
```

Then: `grep -rn "GreenStrip" src` — expected: no matches.

- [ ] **Step 4: Browser check**

Reload. Expected: slim black bar with white letterspaced text at very top, then white header below. No ticker animation.

- [ ] **Step 5: Commit**

```bash
git add -A src/components
git commit -m "feat(redesign): black announcement bar replaces acid ticker"
```

---

### Task 4: Nav rewrite — MEN/WOMEN/ACCESSORIES dropdowns

**Files:**
- Rewrite: `src/components/Nav.jsx` (keep: cart count, auth modal trigger, search modal, ThemeToggle, mobile drawer shell)

- [ ] **Step 1: Replace the `LINKS` constant with grouped nav data**

At the top of `src/components/Nav.jsx`, replace `const LINKS = [...]` with:

```jsx
const NAV_GROUPS = [
  {
    label: 'Men',
    items: [
      { label: 'T-Shirts', value: 't-shirts' },
      { label: 'Shirts', value: 'shirts' },
      { label: 'Jeans', value: 'jeans' },
      { label: 'Trousers', value: 'trousers' },
      { label: "Men's Shoes", value: 'mens-shoes' },
      { label: 'Watches for Men', value: 'watches-men' },
    ],
  },
  {
    label: 'Women',
    items: [
      { label: "Women's Shoes", value: 'womens-shoes' },
      { label: 'Watches for Women', value: 'watches-women' },
    ],
  },
  {
    label: 'Accessories',
    items: [
      { label: 'Sunglasses', value: 'sunglasses' },
      { label: 'Watches for Men', value: 'watches-men' },
      { label: 'Watches for Women', value: 'watches-women' },
    ],
  },
];
const shopHref = (value) => `/shop?categories=${value}`;
```

- [ ] **Step 2: Desktop center nav — dropdown groups + CATEGORIES link**

Replace the desktop `<ul>` block with:

```jsx
<ul className="hidden items-center gap-8 md:flex" role="list">
  {NAV_GROUPS.map((group) => (
    <li key={group.label} className="group relative">
      <button
        type="button"
        className="flex items-center gap-1.5 py-5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-primary transition-opacity hover:opacity-60"
        aria-haspopup="true"
      >
        {group.label}
        <CaretDown size={10} weight="bold" aria-hidden="true" />
      </button>
      <div className="invisible absolute left-1/2 top-full z-50 min-w-[220px] -translate-x-1/2 border border-hairline bg-base opacity-0 shadow-sm transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <ul className="flex flex-col py-3" role="list">
          {group.items.map((item) => (
            <li key={`${group.label}-${item.value}`}>
              <Link
                to={shopHref(item.value)}
                className="block px-6 py-2.5 font-display text-[11px] font-medium uppercase tracking-[0.15em] text-secondary transition-colors hover:bg-elevated hover:text-primary"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  ))}
  <li>
    <NavLink
      to="/categories"
      className={({ isActive }) =>
        `py-5 font-display text-xs font-semibold uppercase tracking-[0.2em] transition-opacity hover:opacity-60 ${
          isActive ? 'text-primary underline underline-offset-8' : 'text-primary'
        }`
      }
    >
      Categories
    </NavLink>
  </li>
</ul>
```

Add `CaretDown` to the phosphor import line.

- [ ] **Step 3: Mobile drawer — accordion groups**

Replace the drawer `<nav>` content (the `LINKS.map(...)` part; keep the Bag link and Sign In/Account block below, restyled `font-black`→`font-semibold`) with:

```jsx
{NAV_GROUPS.map((group) => (
  <MobileGroup key={group.label} group={group} onNavigate={close} />
))}
<Link
  to="/categories"
  onClick={close}
  className="border-b border-hairline py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary"
>
  Categories
</Link>
```

And add at the bottom of the file:

```jsx
function MobileGroup({ group, onNavigate }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-hairline">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-primary"
      >
        {group.label}
        <CaretDown size={12} weight="bold" className={`transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
      </button>
      {open && (
        <div className="flex flex-col pb-3">
          {group.items.map((item) => (
            <Link
              key={`${group.label}-${item.value}`}
              to={`/shop?categories=${item.value}`}
              onClick={onNavigate}
              className="py-2.5 pl-4 font-display text-xs font-medium uppercase tracking-[0.15em] text-secondary"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 4: Brand + icon hover cleanup in Nav**

In the same file: wordmark span `font-extrabold tracking-tight` → `font-bold tracking-[0.08em]`; every icon-button `hover:text-acid` → `hover:opacity-60`; cart badge already swept to `bg-primary text-base` in Task 2 (verify).

- [ ] **Step 5: Browser check**

Reload. Desktop: hover MEN → white dropdown panel with 6 category links; click T-Shirts → `/shop?categories=t-shirts` shows t-shirts. WOMEN → 2 links; ACCESSORIES → 3; CATEGORIES navigates to grid page. Mobile (preview_resize 375×812): hamburger → accordions expand/collapse, links navigate and close drawer.

- [ ] **Step 6: Commit**

```bash
git add src/components/Nav.jsx
git commit -m "feat(redesign): dropdown nav MEN/WOMEN/ACCESSORIES + mobile accordions"
```

---

### Task 5: Queries — createdAt + compareAtPriceRange; verify data

**Files:**
- Modify: `src/lib/shopify/queries.js`
- Modify: `src/lib/shopify/filters.js` (export CATEGORY_TAG_MAP — needed by Task 7)

- [ ] **Step 1: Extend PRODUCT_FIELDS**

In `src/lib/shopify/queries.js` add two fields to `PRODUCT_FIELDS` after `id handle title tags productType`:

```
  createdAt
  compareAtPriceRange { minVariantPrice { amount currencyCode } }
```

- [ ] **Step 2: Extend FEATURED_PRODUCTS_QUERY and PRODUCT_RECOMMENDATIONS_QUERY**

Both queries list fields inline (not via PRODUCT_FIELDS). Add the same two lines to each, next to their `featuredImage { url altText }` line.

- [ ] **Step 3: Export the tag map from filters.js**

In `src/lib/shopify/filters.js` change `const CATEGORY_TAG_MAP = {` to `export const CATEGORY_TAG_MAP = {`.

- [ ] **Step 4: Verify live data carries compare-at prices**

With the dev server running, evaluate in the preview console (preview_eval):

```js
fetch('https://luxerio-62.myshopify.com/api/2024-10/graphql.json', {
  method: 'POST',
  headers: { 'X-Shopify-Storefront-Access-Token': '0edd3f8c5ffd9075b81a65a9fc2c39e7', 'Content-Type': 'application/json' },
  body: JSON.stringify({ query: `{ products(first: 30) { edges { node { title createdAt
    priceRange { minVariantPrice { amount } }
    compareAtPriceRange { minVariantPrice { amount } } } } } }` })
}).then(r => r.json()).then(d => {
  const withCompare = d.data.products.edges.filter(e => parseFloat(e.node.compareAtPriceRange?.minVariantPrice?.amount || 0) > parseFloat(e.node.priceRange.minVariantPrice.amount));
  console.log('[compare-at]', withCompare.length, 'of', d.data.products.edges.length);
});
```

Record the result. Zero is acceptable (sale layout stays dormant per spec) — the card logic in Task 6 must handle both.

- [ ] **Step 5: Reload app, confirm no query errors**

Reload preview; shop page must still render products (no GraphQL field errors in console).

- [ ] **Step 6: Commit**

```bash
git add src/lib/shopify/queries.js src/lib/shopify/filters.js
git commit -m "feat(redesign): fetch createdAt + compareAtPriceRange, export tag map"
```

---

### Task 6: ProductCard — New Arrival badge + sale pricing

**Files:**
- Modify: `src/components/ProductCard.jsx`

- [ ] **Step 1: Replace tag-based badge logic with New Arrival**

Remove `BADGE_MAP` and `getBadge`. Add:

```jsx
const NEW_ARRIVAL_DAYS = 30;

function isNewArrival(createdAt) {
  if (!createdAt) return false;
  return Date.now() - new Date(createdAt).getTime() < NEW_ARRIVAL_DAYS * 24 * 60 * 60 * 1000;
}
```

In the component body replace `const badge = getBadge(tags);` with `const newArrival = isNewArrival(product.createdAt);` and replace the badge JSX block with:

```jsx
{newArrival && (
  <div className="absolute left-3 top-3 bg-primary px-2.5 py-1 font-display text-[9px] font-semibold uppercase tracking-[0.15em] text-base">
    New Arrival
  </div>
)}
```

Keep the `soldOut` overlay logic, but drop its dependence on the removed map: `const soldOut = variants?.edges?.[0]?.node?.availableForSale === false;`

- [ ] **Step 2: Sale pricing line**

Replace the price `<p>` block with:

```jsx
{price && (() => {
  const amount = parseFloat(price.amount);
  const compareAt = parseFloat(product.compareAtPriceRange?.minVariantPrice?.amount ?? 0);
  const onSale = compareAt > amount;
  const savePct = onSale ? Math.round((1 - amount / compareAt) * 100) : 0;
  return (
    <p className="flex flex-wrap items-baseline gap-x-2 font-sans text-sm text-primary">
      {onSale && (
        <span className="text-secondary line-through">{fmt(compareAt, price.currencyCode)}</span>
      )}
      <span className="font-medium">{fmt(amount, price.currencyCode)}</span>
      {onSale && <span className="text-xs font-medium text-sale">Save {savePct}%</span>}
    </p>
  );
})()}
```

- [ ] **Step 3: Card typography — pronk tone**

Title `<p>` classes → `font-display text-[13px] font-medium uppercase tracking-[0.08em] leading-snug text-primary` (drop `group-hover:text-acid`). Remove the acid bottom-border hover div (`<div className="absolute bottom-0 ... bg-acid ..." />`). Keep image hover-swap + fade-in untouched.

- [ ] **Step 4: Browser check**

Reload `/shop`. Expected: cards show medium-weight letterspaced titles, plain prices (or strikethrough + red Save % if Task 5 Step 4 found compare-at data), black "New Arrival" chips on products imported in the last 30 days (the current catalog qualifies — imported this week).

- [ ] **Step 5: Commit**

```bash
git add src/components/ProductCard.jsx
git commit -m "feat(redesign): New Arrival badge + compare-at sale pricing on cards"
```

---

### Task 7: StoryBubbles — circular category row

**Files:**
- Create: `src/components/StoryBubbles.jsx`
- Modify: `src/pages/Home.jsx`

- [ ] **Step 1: Create `src/components/StoryBubbles.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { storefrontQuery } from '../lib/shopify/client.js';
import { CATEGORY_OPTIONS, CATEGORY_TAG_MAP } from '../lib/shopify/filters.js';
import { shopifyImg, markLoaded, onImgLoad } from '../lib/shopify/image.js';

/*
  Pronk-style circular category row. Thumbnail = featured image of the first
  product in each category, fetched in ONE aliased query. No manual assets.
*/
const CATS = CATEGORY_OPTIONS.filter((c) => c.value !== '');

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
  const { data } = useQuery({
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
                {img && (
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
```

- [ ] **Step 2: Wire into `src/pages/Home.jsx`**

```jsx
import StoryBubbles from '../components/StoryBubbles.jsx';
import Hero from '../components/Hero.jsx';
import CategoryBento from '../components/CategoryBento.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';

export default function Home() {
  return (
    <>
      <StoryBubbles />
      <Hero heroBg="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1920&q=80&auto=format&fit=crop" />
      <FeaturedProducts />
      <CategoryBento />
    </>
  );
}
```

(Order per spec: bubbles → hero → best sellers → bento.)

- [ ] **Step 3: Browser check**

Reload home. Expected: row of 9 circles under the header, each with a product photo and label; click "Jeans" → `/shop?categories=jeans` shows jeans. Row scrolls horizontally on mobile width.

- [ ] **Step 4: Commit**

```bash
git add src/components/StoryBubbles.jsx src/pages/Home.jsx
git commit -m "feat(redesign): story-bubble category row on home"
```

---

### Task 8: Hero — 60vh light banner

**Files:**
- Rewrite: `src/components/Hero.jsx`

- [ ] **Step 1: Rewrite `src/components/Hero.jsx`**

```jsx
import { Link } from 'react-router-dom';
import { ArrowRight } from '@phosphor-icons/react';
import { trackEvent, EVENTS } from '../lib/analytics/ga4.js';

export default function Hero({ heroBg }) {
  const handleCta = () => {
    trackEvent(EVENTS.SELECT_PROMOTION, {
      promotion_name: 'hero_new_drop',
      creative_slot: 'hero',
    });
  };

  return (
    <section
      className="relative min-h-[60vh] w-full overflow-hidden bg-elevated bg-cover bg-center"
      style={heroBg ? { backgroundImage: `url(${heroBg})` } : undefined}
    >
      {/* Scrim for text legibility over photo. */}
      <div className="absolute inset-0 bg-black/30" />

      <div className="relative z-10 flex min-h-[60vh] flex-col items-start justify-end px-6 pb-14 lg:px-16">
        <p className="mb-3 font-display text-[11px] font-semibold uppercase tracking-[0.25em] text-white/80">
          New Drop / FW25
        </p>
        <h1 className="max-w-2xl font-display text-4xl font-semibold uppercase tracking-[0.06em] text-white md:text-6xl">
          New Season
          <br />
          Essentials
        </h1>
        <div className="mt-7">
          <Link
            to="/shop"
            onClick={handleCta}
            className="inline-flex items-center gap-3 bg-white px-7 py-3.5 font-display text-xs font-semibold uppercase tracking-[0.2em] text-black transition-opacity hover:opacity-85 active:scale-[0.98]"
          >
            Shop Now
            <ArrowRight size={14} weight="bold" />
          </Link>
        </div>
      </div>
    </section>
  );
}
```

(Removed: full-viewport height, acid grid texture, acid bottom border, second CTA.)

- [ ] **Step 2: Browser check**

Reload home. Expected: banner ~60% of viewport height below the bubbles, lifestyle image, white CTA button. No green line, no grid overlay.

- [ ] **Step 3: Commit**

```bash
git add src/components/Hero.jsx src/pages/Home.jsx
git commit -m "feat(redesign): 60vh light hero banner"
```

---

### Task 9: BEST SELLERS — centered header + VIEW ALL

**Files:**
- Modify: `src/components/FeaturedProducts.jsx`

- [ ] **Step 1: Replace the section header block**

Replace the `<div className="mb-10 flex items-center justify-between">...</div>` header with:

```jsx
<div className="mb-10 flex flex-col items-center gap-4">
  <h2 className="font-display text-2xl font-semibold uppercase tracking-[0.15em] text-primary md:text-3xl">
    Best Sellers
  </h2>
  <Link
    to="/shop"
    className="border border-primary px-8 py-2.5 font-display text-[11px] font-semibold uppercase tracking-[0.2em] text-primary transition-colors hover:bg-primary hover:text-base active:scale-[0.98]"
  >
    View All
  </Link>
</div>
```

Remove the now-unused `ArrowRight` import if nothing else uses it. Change `useFeaturedProducts({ first: 4 })` → `useFeaturedProducts({ first: 8 })` and the grid to `grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4` (two pronk-like rows). Update the GA4 `item_list_name` from `'recent_acquisitions'` to `'best_sellers'` (both occurrences: the effect and the ProductCard `listName` prop). In `EmptyState`, the chip already got swept to `bg-primary text-base` in Task 2 — verify.

- [ ] **Step 2: Browser check**

Reload home. Expected: centered "BEST SELLERS" heading, outlined VIEW ALL button beneath, 8 cards in 2×4 grid (desktop).

- [ ] **Step 3: Commit**

```bash
git add src/components/FeaturedProducts.jsx
git commit -m "feat(redesign): centered BEST SELLERS section with VIEW ALL"
```

---

### Task 10: Bento tiles — real categories, pronk labels

**Files:**
- Modify: `src/components/CategoryBento.jsx`

- [ ] **Step 1: Replace the CATEGORIES constant**

```jsx
const IMG = (id) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1000&q=80`;

const CATEGORIES = [
  {
    label: 'T-Shirts',
    tag: 'TOPS',
    href: '/shop?categories=t-shirts',
    accent: 'col-span-2 row-span-2',
    img: IMG('1521572163474-6864f9cf17ab'),
  },
  {
    label: 'Jeans',
    tag: 'DENIM',
    href: '/shop?categories=jeans',
    accent: '',
    img: IMG('1542272604-787c3835535d'),
  },
  {
    label: "Men's Shoes",
    tag: 'FOOTWEAR',
    href: '/shop?categories=mens-shoes',
    accent: '',
    img: IMG('1542291026-7eec264c27ff'),
  },
];
```

- [ ] **Step 2: Pronk-style tile chrome**

In the tile JSX: replace the acid corner tag div with a bottom-left label (pronk look):

```jsx
<div className="absolute bottom-0 left-0 right-0 p-5">
  <p className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-white md:text-base">
    {cat.label}
  </p>
</div>
```

Remove the old `{/* Acid corner tag */}` block and the old label block (which had `cat.sub`). Keep the scrim gradient div and hover zoom. Section heading: `Classifications` → `Shop By Category`, classes `font-display text-2xl font-semibold uppercase tracking-[0.15em] text-primary md:text-3xl`; replace the `h-[2px] flex-1 mx-8 bg-hairline` divider line — keep it, it's neutral.

- [ ] **Step 3: Browser check**

Reload home, scroll to bento. Expected: 1 big + 2 small tiles, white letterspaced labels bottom-left, links filter shop correctly.

- [ ] **Step 4: Commit**

```bash
git add src/components/CategoryBento.jsx
git commit -m "feat(redesign): bento tiles for live categories, pronk labels"
```

---

### Task 11: Product page — BUY NOW

**Files:**
- Modify: `src/pages/Product.jsx`

- [ ] **Step 1: Imports + state**

Add to imports in `src/pages/Product.jsx`:

```jsx
import { storefrontQuery } from '../lib/shopify/client.js';
import { CART_CREATE } from '../lib/shopify/mutations.js';
import { Lightning } from '@phosphor-icons/react';
```

Add state next to `addedMsg`: `const [buying, setBuying] = useState(false);`

- [ ] **Step 2: Handler — fresh single-item cart → checkout redirect**

Add below `handleAddToBag`:

```jsx
// Buy Now: separate one-item cart straight to Shopify checkout.
// Deliberately does NOT touch the persistent bag cart (localStorage id stays).
const handleBuyNow = async () => {
  if (!selected || buying) return;
  setBuying(true);
  trackEvent(EVENTS.BEGIN_CHECKOUT, {
    value: parseFloat(selected.price?.amount ?? 0),
    currency: selected.price?.currencyCode,
    items: [{ item_id: selected.id, item_name: product.title, price: parseFloat(selected.price?.amount ?? 0) }],
  });
  try {
    const d = await storefrontQuery(CART_CREATE, {
      lines: [{ merchandiseId: selected.id, quantity: 1 }],
    });
    const url = d.cartCreate?.cart?.checkoutUrl;
    if (url) {
      window.location.href = url;
      return; // navigating away — leave button in loading state
    }
    setBuying(false);
  } catch {
    setBuying(false);
  }
};
```

Before writing, open `src/lib/shopify/mutations.js` and confirm `CART_CREATE` takes a `$lines: [CartLineInput!]!` variable (CartContext already calls it with `{ lines: [lineInput] }` — same shape).

- [ ] **Step 3: Buttons — BUY NOW primary, ADD TO BAG secondary**

Replace the single add-to-bag `<button>` block with a two-button stack:

```jsx
<div className="flex flex-col gap-3">
  <button
    type="button"
    onClick={handleBuyNow}
    disabled={soldOut || !selected || buying}
    className="flex w-full items-center justify-center gap-3 bg-primary py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] text-base transition-opacity hover:opacity-85 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
  >
    {buying ? 'Redirecting…' : soldOut ? 'Sold Out' : (<><Lightning size={16} weight="fill" /> Buy Now</>)}
  </button>

  <button
    type="button"
    onClick={handleAddToBag}
    disabled={soldOut || !selected}
    className={`flex w-full items-center justify-center gap-3 border py-4 font-display text-sm font-semibold uppercase tracking-[0.2em] transition-colors active:scale-[0.98] ${
      soldOut
        ? 'cursor-not-allowed border-hairline text-secondary opacity-50'
        : addedMsg
        ? 'border-primary bg-primary text-base'
        : 'border-primary text-primary hover:bg-primary hover:text-base'
    }`}
  >
    {addedMsg ? (<>Added <Check size={16} weight="bold" /></>) : (<><ShoppingBag size={16} weight="regular" /> Add To Bag</>)}
  </button>
</div>
```

Keep the free-shipping trust line below the stack.

- [ ] **Step 4: Verify end-to-end**

Reload a product page (e.g. `/product/<any-handle>` from /shop). Select a size. Click BUY NOW. Expected: button shows "Redirecting…", browser lands on `luxerio-62.myshopify.com/checkouts/...` (store password `mayghu` if prompted) with exactly 1 item. Go back, check bag icon count unchanged. Then ADD TO BAG → count increments, no navigation.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Product.jsx
git commit -m "feat: Buy Now button — fresh single-item cart straight to checkout"
```

---

### Task 12: Remaining-surface sweep + final verification

**Files:** `src/pages/ShopAll.jsx`, `src/pages/Categories.jsx`, `src/pages/Cart.jsx`, `src/pages/Account.jsx`, `src/components/Footer.jsx`, `src/components/FilterRail.jsx`, `src/components/OrderSummary.jsx`, `src/components/AuthModal.jsx`, `src/components/SearchModal.jsx`, `src/components/SortDropdown.jsx`, `src/components/StylingTips.jsx`

- [ ] **Step 1: Page headings sweep**

In ShopAll (`SHOP` h1), Categories (`Classifications` h1 → rename text to `Categories`), Cart, Account, Product (title h1): heading classes `font-black`/`font-extrabold` were already softened in Task 2; now also relax tracking: `tracking-tight` → `tracking-[0.1em]` on those h1s. Subtitle lines keep `text-secondary`.

- [ ] **Step 2: Copy de-brutalization**

- ShopAll results line: `Showing N technical garment(s)+.` → `Showing N product(s)+.` and empty state `No garments found.` → `No products found.` (in `src/pages/ShopAll.jsx`).
- Footer: no copy change needed; verify logo + wordmark render, links neutral hover (`hover:text-acid` renders monochrome now — acceptable; optionally swap to `hover:opacity-60`).
- Hero already de-tactical (Task 8).

- [ ] **Step 3: Grep assertions**

```bash
grep -rn "font-black" src --include="*.jsx"        # expected: none
grep -rn "GreenStrip" src                           # expected: none
grep -rn "bg-acid text-black" src --include="*.jsx" # expected: none
grep -rn "c6f500" src tailwind.config.js            # expected: none
```

- [ ] **Step 4: Full-flow browser pass (both themes)**

Light + dark, desktop + 375px mobile:
1. Home: announcement bar → header dropdowns → bubbles → hero → best sellers → bento → footer.
2. `/shop?categories=t-shirts&sizes=M` — filter rail groups (Clothing/Waist/Men's shoes/Women's shoes), results correct.
3. Product page: gallery, sizes, BUY NOW → checkout, ADD TO BAG → cart page → discount field → INITIATE CHECKOUT.
4. Auth modal sign-in tab renders, `/categories` grid renders.
5. Console: no errors (GA4 mock lines OK).

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat(redesign): pronk-style restyle sweep across remaining pages"
```

---

## Self-Review (done at write time)

- **Spec coverage:** §1 tokens→Task 1/2 · §2 header stack→Tasks 3/4 · §3 home→Tasks 7/8/9/10 · §4 cards→Tasks 5/6 · §5 Buy Now→Task 11 · §6 remaining pages→Task 12 (+Task 2 sweep). Categories page kept (Task 12 renames heading only).
- **Placeholders:** none — every code step carries the code; announcement copy + hero image are explicitly client-swappable constants per spec's Out of Scope.
- **Type consistency:** `CATEGORY_TAG_MAP` export (Task 5) precedes StoryBubbles import (Task 7). `shopHref` local to Nav. `sale` Tailwind alias (Task 1) used by Task 6. `CART_CREATE` `{ lines }` shape verified against CartContext usage in Task 11 Step 2.
