"""
Scrape menu, retail products and store locations from https://www.coffeebean.pk
and write them into the new frontend.

Sources on the old site:
  - Cafe menu (Beverage / Food): HTML listing pages + one detail page per item
  - Retail products (coffee beans, tea, cakes): WooCommerce Store API (JSON)
  - Stores: Agile Store Locator AJAX endpoint (JSON)

Output:
  scripts/output/*.json                       raw scraped data
  frontend/public/images/cbtl/<type>/*.jpg    downloaded images
  frontend/src/data/cbtl/*.js                 JS modules shaped like data/menuItems.js

Usage:
  pip install requests beautifulsoup4
  python scripts/scrape_coffeebean.py            # scrape + download images
  python scripts/scrape_coffeebean.py --no-images
"""

import argparse
import html
import json
import re
import sys
import time
from pathlib import Path
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup, Comment

BASE = "https://www.coffeebean.pk"
ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "scripts" / "output"
FRONTEND = ROOT / "frontend"
IMG_DIR = FRONTEND / "public" / "images" / "cbtl"
DATA_DIR = FRONTEND / "src" / "data" / "cbtl"

# The site returns "406 Not Acceptable" without browser-like headers.
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/126.0 Safari/537.36",
    "Accept": "text/html,application/json,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.9",
}
DELAY = 0.4  # seconds between requests, to be polite

session = requests.Session()
session.headers.update(HEADERS)


def get(url, **kw):
    for attempt in range(3):
        try:
            r = session.get(url, timeout=30, **kw)
            r.raise_for_status()
            time.sleep(DELAY)
            return r
        except requests.RequestException as e:
            if attempt == 2:
                raise
            print(f"  retry {url}: {e}")
            time.sleep(2)


def clean(text):
    """Unescape HTML entities, strip tags and collapse whitespace."""
    if not text:
        return ""
    text = BeautifulSoup(html.unescape(text), "html.parser").get_text(" ")
    return re.sub(r"\s+", " ", text).strip()


def slugify(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


# ---------------------------------------------------------------- cafe menu

def scrape_menu_section(section):
    """section is 'beverage' or 'food'."""
    print(f"Menu: {section}")
    soup = BeautifulSoup(get(f"{BASE}/{section}/").text, "html.parser")

    # Filter buttons map class slug -> readable label, e.g. "tea-latte" -> "Tea Latte"
    labels = {
        a["data-filter"]: clean(a.get_text())
        for a in soup.select(".rfpfilters a[data-filter]")
        if a["data-filter"] != "*"
    }

    items = []
    for el in soup.select(".rfp-posts .rfp-item"):
        link = el.select_one("a.rfp-mask")
        img = el.select_one("img.rfp-img")
        name = clean(el.select_one(".rfp-item-title").get_text())
        subcats = [labels[c] for c in el.get("class", []) if c in labels]
        items.append({
            "name": name,
            "slug": slugify(name),
            "section": section.title(),
            "category": subcats[0] if subcats else section.title(),
            "categories": subcats,
            "url": link["href"] if link else None,
            "image": img["src"] if img else None,
        })

    for i, item in enumerate(items, 1):
        if not item["url"]:
            continue
        print(f"  [{i}/{len(items)}] {item['name']}")
        detail = BeautifulSoup(get(item["url"]).text, "html.parser")
        body = detail.select_one(".mprm-post-content")
        item["description"] = clean(body.decode_contents()) if body else ""
        # Detail header has the full-size image as a CSS background.
        header = detail.select_one(".mprm-header")
        m = re.search(r"url\((.*?)\)", header.get("style", "")) if header else None
        item["image_full"] = m.group(1).strip("'\"") if m else item["image"]

    return items


# ------------------------------------------------------------ retail products

def scrape_products():
    print("Products (WooCommerce Store API)")
    products, page = [], 1
    while True:
        r = get(f"{BASE}/wp-json/wc/store/v1/products", params={"per_page": 100, "page": page})
        batch = r.json()
        if not batch:
            break
        for p in batch:
            cats = [clean(c["name"]) for c in p.get("categories", [])]
            price = int(p["prices"]["price"] or 0) / (10 ** p["prices"]["currency_minor_unit"])
            products.append({
                "id": p["id"],
                "name": clean(p["name"]),
                "slug": p["slug"],
                # Top-level category (Coffee / Tea / Cake) first, then the sub-category.
                "category": next((c for c in cats if c in ("Coffee", "Tea", "Cake")), cats[0] if cats else "Other"),
                "categories": cats,
                "short_description": clean(p.get("short_description")),
                "description": clean(p.get("description")),
                "price": price or None,
                "currency": p["prices"]["currency_code"],
                "url": p["permalink"],
                "image": p["images"][0]["src"] if p.get("images") else None,
            })
        if len(batch) < 100:
            break
        page += 1
    print(f"  {len(products)} products")
    return products


# -------------------------------------------------------------------- stores

DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]


def scrape_stores():
    print("Stores (Agile Store Locator)")
    r = get(f"{BASE}/wp-admin/admin-ajax.php", params={"action": "asl_load_stores", "load_all": 1, "layout": 1})
    stores = []
    for s in r.json():
        try:
            hours = json.loads(s.get("open_hours") or "{}")
        except json.JSONDecodeError:
            hours = {}
        stores.append({
            "id": int(s["id"]),
            "name": clean(s["title"]),
            "address": clean(s["street"]),
            "city": clean(s["city"]),
            "state": clean(s["state"]),
            "country": clean(s["country"]),
            "phone": s.get("phone") or "",
            "email": s.get("email") or "",
            "lat": float(s["lat"]) if s.get("lat") else None,
            "lng": float(s["lng"]) if s.get("lng") else None,
            "hours": {d: ", ".join(v) if isinstance(v, list) else str(v) for d, v in hours.items() if d in DAYS},
        })
    print(f"  {len(stores)} stores")
    return stores


# --------------------------------------------------------------------- pages

# WordPress/WooCommerce utility pages with no real content.
SKIP_PAGES = {"online-test", "job-dashboard", "post-a-job", "my-account", "checkouthide", "carthide", "shop-three-columns"}
BLOCK_TAGS = {"h1", "h2", "h3", "h4", "h5", "h6", "p", "li", "div", "td", "th", "blockquote", "section", "address", "dt", "dd"}
BG_RE = re.compile(r"background-image\s*:\s*url\((.*?)\)")
# Button labels and theme leftovers that are not real content.
NOISE_TEXT = {"read more", "add to cart", "loading...", "print", "×", "&times;"}


def extract_blocks(root):
    """Walk the content in page order and return text/heading/image blocks."""
    for t in root(["script", "style", "noscript", "form", "iframe", "nav", "svg"]):
        t.decompose()
    for t in root.select("#comments, .edgtf-comment-holder, .rfp-filter, .asl-cont"):
        t.decompose()

    blocks, seen_imgs = [], set()
    # Strings are grouped by their nearest block ancestor so inline tags
    # (<span>, <strong>, <a>) stay part of the same sentence.
    current, current_parts = None, []

    def flush():
        nonlocal current, current_parts
        text = re.sub(r"\s+", " ", " ".join(current_parts)).strip()
        if current is not None and text:
            if current.name in ("h1", "h2", "h3", "h4", "h5", "h6"):
                blocks.append({"type": "heading", "level": int(current.name[1]), "text": text})
            elif current.name == "li":
                blocks.append({"type": "list_item", "text": text})
            else:
                blocks.append({"type": "text", "text": text})
        current, current_parts = None, []

    def add_image(src, alt=""):
        src = (src or "").strip("'\" ")
        if not src or src.startswith("data:") or src.endswith("/dummy.png"):
            return
        src = urljoin(BASE + "/", src)
        if src not in seen_imgs:
            seen_imgs.add(src)
            flush()
            blocks.append({"type": "image", "src": src, "alt": alt})

    for node in root.descendants:
        if getattr(node, "name", None):
            m = BG_RE.search(node.get("style", ""))
            if m:
                add_image(m.group(1))
            if node.name == "img":
                # Revolution Slider keeps the real image in data-lazyload behind a dummy.png.
                add_image(node.get("data-lazyload") or node.get("data-src") or node.get("src"), node.get("alt", ""))
            continue
        if isinstance(node, Comment):
            continue
        text = str(node).strip()
        if not text or node.parent.name in ("script", "style") or text.lower() in NOISE_TEXT:
            continue
        block = next((p for p in node.parents if p.name in BLOCK_TAGS), root)
        if block is not current:
            flush()
            current = block
        current_parts.append(text)
    flush()
    return blocks


def scrape_pages():
    print("Pages")
    r = get(f"{BASE}/wp-json/wp/v2/pages", params={"per_page": 100, "_fields": "id,slug,link,title,modified"})
    pages = []
    for p in r.json():
        if p["slug"] in SKIP_PAGES:
            continue
        print(f"  {p['slug']}")
        soup = BeautifulSoup(get(p["link"]).text, "html.parser")
        meta = soup.select_one('meta[name="description"]') or soup.select_one('meta[property="og:description"]')
        content = soup.select_one(".edgtf-content-inner") or soup.select_one(".edgtf-content") or soup.body
        # The page hero (title + background) sits outside the content area.
        hero = soup.select_one(".edgtf-title")
        hero_img = None
        if hero:
            m = BG_RE.search(str(hero))
            img = hero.select_one("img")
            hero_img = m.group(1).strip("'\"") if m else (img.get("src") if img else None)
            hero_img = urljoin(BASE + "/", hero_img) if hero_img else None
        pages.append({
            "slug": p["slug"],
            "url": p["link"],
            "title": clean(p["title"]["rendered"]),
            "meta_description": meta.get("content", "") if meta else "",
            "hero_image": hero_img,
            "modified": p["modified"],
            "blocks": extract_blocks(content),
        })
    print(f"  {len(pages)} pages")
    return pages


def scrape_site_info():
    """Header/footer data shared by every page: logo, nav, opening hours, contact, socials."""
    print("Site info (header/footer)")
    soup = BeautifulSoup(get(f"{BASE}/").text, "html.parser")
    logo = soup.select_one(".edgtf-logo-wrapper img") or soup.select_one('link[rel="icon"]')

    nav = []
    for li in soup.select(".edgtf-main-menu.edgtf-default-nav > ul > li"):
        a = li.find("a")
        nav.append({
            "label": clean(a.get_text()),
            "url": a.get("href"),
            "children": [{"label": clean(c.get_text()), "url": c.get("href")} for c in li.select(".edgtf-menu-second a")],
        })

    footer = soup.select_one("footer")
    socials = sorted({
        a["href"] for a in soup.select("a[href]")
        if re.search(r"facebook|instagram|twitter|youtube|linkedin|tiktok", a["href"])
    })
    emails = sorted({a["href"][7:].strip() for a in soup.select('a[href^="mailto:"]')})
    phones = [a["href"][4:].strip() for a in soup.select('a[href^="tel:"]')]

    footer_blocks = extract_blocks(footer) if footer else []

    # Opening hours: in the footer each location is a heading followed by "days time" rows.
    hours, in_hours = [], False
    for b in footer_blocks:
        text = b.get("text", "")
        if b["type"] == "heading":
            if text.lower() == "opening hours":
                in_hours = True
            elif text.lower() == "contact":
                in_hours = False
            elif in_hours and re.search(r"[a-z]", text, re.I):
                hours.append({"location": text, "hours": []})
        elif in_hours and hours and b["type"] == "text":
            m = re.match(r"(.*day)\s+(.+)", text, re.I)
            hours[-1]["hours"].append({"days": m.group(1), "time": m.group(2)} if m else {"days": "", "time": text})

    for b in footer_blocks:
        phones.extend(re.findall(r"\b0\d{3}[\s-]?\d{7}\b", b.get("text", "")))

    return {
        "name": clean(soup.title.get_text()) if soup.title else "",
        "logo": urljoin(BASE + "/", logo.get("src") or logo.get("href")) if logo else None,
        "navigation": nav,
        "emails": emails,
        "phones": sorted(set(phones)),
        "socials": socials,
        "opening_hours": hours,
        "footer_blocks": footer_blocks,
    }


# -------------------------------------------------------------------- images

def download_image(url, folder, name):
    """Save url under public/images/cbtl/<folder>/ and return its public path."""
    if not url:
        return None
    ext = Path(urlparse(url).path).suffix.lower() or ".jpg"
    dest = IMG_DIR / folder / f"{name}{ext}"
    public = f"/images/cbtl/{folder}/{dest.name}"
    if dest.exists():
        return public
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        dest.write_bytes(get(url).content)
        return public
    except requests.RequestException as e:
        print(f"  image failed {url}: {e}")
        return url  # fall back to the remote URL


# -------------------------------------------------------------------- output

def write_js(path, header, exports):
    """Write a JS module with `export const <name> = <json>` for each export."""
    path.parent.mkdir(parents=True, exist_ok=True)
    parts = [f"// {header}\n// Generated by scripts/scrape_coffeebean.py - do not edit by hand.\n"]
    for name, value in exports.items():
        parts.append(f"export const {name} = {json.dumps(value, indent=2, ensure_ascii=False)}\n")
    path.write_text("\n".join(parts), encoding="utf-8")
    print(f"Wrote {path.relative_to(ROOT)}")


def unique(seq):
    return list(dict.fromkeys(seq))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--no-images", action="store_true", help="keep remote image URLs instead of downloading")
    args = ap.parse_args()

    menu = scrape_menu_section("beverage") + scrape_menu_section("food")
    products = scrape_products()
    stores = scrape_stores()
    pages = scrape_pages()
    site = scrape_site_info()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    (OUT_DIR / "site.json").write_text(json.dumps(site, indent=2, ensure_ascii=False), encoding="utf-8")
    for name, data in (("menu", menu), ("products", products), ("stores", stores), ("pages", pages)):
        (OUT_DIR / f"{name}.json").write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"Wrote scripts/output/{name}.json ({len(data)})")

    if not args.no_images:
        print("Downloading images")
        for item in menu:
            item["img"] = download_image(item.get("image_full") or item["image"], "menu", item["slug"])
        for p in products:
            p["img"] = download_image(p["image"], "products", slugify(p["name"]))
        for page in pages:
            images = [b for b in page["blocks"] if b["type"] == "image"]
            for n, b in enumerate(images, 1):
                b["src"] = download_image(b["src"], f"pages/{page['slug']}", f"{n:02d}-{slugify(Path(urlparse(b['src']).path).stem)}")
            if page["hero_image"]:
                page["hero_image"] = download_image(page["hero_image"], f"pages/{page['slug']}", "hero")
        if site["logo"]:
            site["logo"] = download_image(site["logo"], "site", "logo")
    else:
        for item in menu:
            item["img"] = item.get("image_full") or item["image"]
        for p in products:
            p["img"] = p["image"]

    # Same shape as src/data/menuItems.js: { name, desc, price, img, category, badge }.
    # The old site shows no menu prices, so price is null - fill it in before using.
    menu_items = [
        {
            "name": m["name"],
            "desc": m.get("description", ""),
            "price": None,
            "img": m["img"],
            "category": m["category"],
            "section": m["section"],
        }
        for m in menu
    ]
    write_js(
        DATA_DIR / "menu.js",
        "Cafe menu scraped from coffeebean.pk (Beverage + Food). Prices are not published on the old site.",
        {
            "sections": unique(m["section"] for m in menu_items),
            "categories": unique(m["category"] for m in menu_items),
            "menuItems": menu_items,
        },
    )

    product_items = [
        {
            "name": p["name"],
            "desc": p["short_description"] or p["description"],
            "price": p["price"],
            "img": p["img"],
            "category": p["category"],
            "subcategories": [c for c in p["categories"] if c != p["category"]],
        }
        for p in products
    ]
    write_js(
        DATA_DIR / "products.js",
        "Retail products (coffee beans, tea, cakes) scraped from coffeebean.pk.",
        {
            "productCategories": unique(p["category"] for p in product_items),
            "products": product_items,
        },
    )

    write_js(DATA_DIR / "stores.js", "Store locations scraped from coffeebean.pk.", {"stores": stores})

    write_js(
        DATA_DIR / "pages.js",
        "Content of every page on coffeebean.pk, as ordered heading/text/image blocks, keyed by slug.",
        {"pages": {p["slug"]: p for p in pages}},
    )
    write_js(DATA_DIR / "site.js", "Header/footer info from coffeebean.pk (nav, contact, socials, hours).", {"site": site})

    print(f"\nDone: {len(menu)} menu items, {len(products)} products, {len(stores)} stores, {len(pages)} pages.")


if __name__ == "__main__":
    sys.exit(main())
