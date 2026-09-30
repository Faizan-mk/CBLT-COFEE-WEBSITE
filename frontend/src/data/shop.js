// Packaged coffee and tea from the coffeebean.pk Coffee and Tea pages (see ./cbtl/products.js).
import { products } from "./cbtl/products"

// Online-ordering notes from the old shop; the site takes no orders.
const cleanDesc = (desc) => desc.replace(/\s*\*In-store pickup.*$/i, "").trim()

const toItem = (p) => ({
  name: p.name,
  desc: cleanDesc(p.desc),
  img: p.img,
  // Tab this item sits under; null when the old site gave it no sub-category.
  category: p.subcategories[0] ?? null,
})

// Apple Chai is a tea blend but has no category on the old site.
const isTea = (p) => p.category === "Tea" || p.name === "Apple Chai"

export const coffees = products.filter((p) => p.category === "Coffee").map(toItem)
export const teas = products.filter(isTea).map(toItem)

export const ALL = "All"
export const tabsFor = (items) => [ALL, ...new Set(items.map((i) => i.category).filter(Boolean))]
