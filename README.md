# Meridian Supply Co. — Portfolio E-Commerce Store

A hand-built, dependency-free specialty-coffee store designed to showcase
web development and technical SEO work. No frameworks, no build step — just
open `index.html`.

## Pages
- `index.html` — Homepage (hero, featured products, process, newsletter)
- `shop.html` — Full catalog with live roast-level filtering
- `product.html?id=SLUG` — Product detail page (dynamic per product)
- `about.html` — Sourcing story / brand page

## SEO features to point clients to
- **Unique title + meta description** on every page
- **Canonical URLs** to prevent duplicate-content issues
- **Open Graph + Twitter Card** tags for rich social previews
- **JSON-LD structured data**: Organization, WebSite (with Sitelinks
  Searchbox), BreadcrumbList, and per-product `Product` + `Offer` schema
  (price, availability, roast/process/altitude)
- **Semantic HTML5** landmarks (`header`, `main`, `nav`, `article`, `section`)
- **Accessibility**: skip link, ARIA labels, visible focus states, reduced-motion
- **`sitemap.xml`** and **`robots.txt`** included
- Fast, framework-free load; system + Google Fonts only

## How to add a product
Open `js/products.js` and copy one product block. Change the fields:

```js
{
  id: "new-origin",          // unique URL slug, lowercase-hyphenated
  name: "Bourbon",
  origin: "El Salvador",
  coords: "13.7942° N, 88.8965° W",
  price: 23,
  weight: "12 oz (340g)",
  roast: "Medium",           // controls shop filters (Light/Medium/Dark/Blend/Decaf)
  process: "Washed",
  altitude: "1,500 masl",
  notes: ["Caramel", "Cherry", "Almond"],
  tag: "New",                // optional badge, "" for none
  featured: true,            // true = show on homepage
  stock: true,               // false = "Sold out"
  blurb: "One or two sentences describing the coffee.",
  color: "#7a4a2a"           // bag color on cards / detail page
}
```

The product automatically appears on the shop page, gets its own detail
page at `product.html?id=new-origin`, and generates its own Product schema.
Remember to add its URL to `sitemap.xml`.

## Notes
Cart is in-session (resets on reload) and checkout is a demo — this is a
portfolio piece, not a live store. Swap in a real backend (Stripe, Shopify
Storefront API, etc.) to make it transactional.
