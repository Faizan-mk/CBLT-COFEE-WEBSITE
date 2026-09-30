import { useRef, useState } from "react"
import PageHero from "../components/PageHero"
import MenuCard from "../components/MenuCard"
import Button from "../components/Button"
import { categories, inCategory, menuItems, money } from "../data/menuItems"
import { gsap, useGSAP, reducedMotion } from "../lib/gsap"

function Menu() {
  const [active, setActive] = useState(categories[0])
  const filtered = menuItems.filter((item) => inCategory(item, active))
  const grid = useRef(null)
  const switched = useRef(false)

  useGSAP(
    () => {
      if (!switched.current || reducedMotion()) return
      gsap.from(grid.current.children, {
        rotateY: -70,
        x: 60,
        opacity: 0,
        transformPerspective: 1000,
        transformOrigin: "0% 50%",
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
      })
    },
    { dependencies: [active] }
  )

  return (
    <>
      <PageHero
        title="Our Menu"
        subtitle="From handcrafted espresso and whole-leaf teas to fresh food and cakes, served in every Coffee Bean store."
      />
      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => {
                switched.current = true
                setActive(c)
              }}
              className={`px-6 py-3 rounded-full font-bold text-sm transition-colors ${
                active === c
                  ? "bg-[#f9c06a] text-[#1e1e1e] shadow-[0px_6px_12px_0px_rgba(249,192,106,0.35)]"
                  : "bg-[#fff9f1] border border-[#f9c06a]/40 text-[#603809] hover:bg-[#ffeed8]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div ref={grid} className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filtered.map((item) => (
            <MenuCard key={item.name} {...item} price={money(item.price)} />
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 md:px-10 pb-16 md:pb-24 text-center">
        <p className="text-[#603809] text-2xl md:text-3xl font-bold mb-4">
          Visit the outlet near you
        </p>
        <p className="text-[#707070] text-base md:text-lg mb-8">
          At The Coffee Bean &amp; Tea Leaf, we care about what you have to say.
        </p>
        <Button to="/contact">Contact Us</Button>
      </section>
    </>
  )
}

export default Menu
