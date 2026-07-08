import StoryBubbles from '../components/StoryBubbles.jsx';
import Hero from '../components/Hero.jsx';
import CategoryBento from '../components/CategoryBento.jsx';
import FeaturedProducts from '../components/FeaturedProducts.jsx';

/*
  Phase B — Home.
  Data flow: Shopify Storefront API via TanStack Query → FeaturedProducts.
  Hero background: pass `heroBg` prop with a CDN image URL to go full-bleed.
  GA4 events: page_view (App.jsx), select_promotion (Hero), view_item_list +
  select_item (FeaturedProducts/CategoryBento).
*/
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
