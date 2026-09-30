import {
  imgCoffeeBeansIcon,
  imgBadgeIcon,
  imgCoffeeCupIcon,
  imgBestPriceIcon,
} from "../assets/images"
import { useRef } from "react"
import Button from "./Button"
import { useTilt } from "../lib/usePointerFx"

const features = [
  { title: "Top 1% Arabica", desc: "Only the finest beans from the best growing regions", icon: imgCoffeeBeansIcon, filled: true },
  { title: "Small-Batch Roasting", desc: "Roasted to perfection in Camarillo, California", icon: imgBadgeIcon },
  { title: "Hand-Blended Tea", desc: "Whole-leaf teas from family-owned estates", icon: imgCoffeeCupIcon },
  { title: "No Middleman", desc: "We buy directly from the growers", icon: imgBestPriceIcon },
]

function FeatureCard({ title, desc, icon, filled }) {
  const card = useRef(null)
  useTilt(card, { max: 16, scale: 1.05 })
  return (
    <div className="h-full">
      <div
        ref={card}
        className={`group relative h-full rounded-[16px] p-8 text-center overflow-hidden ${
          filled ? "bg-[#ffeed8]" : "bg-[#fff9f1] border border-[#f9c06a]/40"
        }`}
      >
        <img
          src={icon}
          alt=""
          className="w-[72px] h-[72px] object-cover mx-auto mb-6 transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:[transform:translateZ(60px)_rotateY(360deg)]"
        />
        <h3 className="text-[#603809] text-xl font-bold mb-2" style={{ transform: "translateZ(30px)" }}>
          {title}
        </h3>
        <p className="text-[#707070] text-sm leading-relaxed" style={{ transform: "translateZ(20px)" }}>
          {desc}
        </p>
        <div data-glare className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay" />
      </div>
    </div>
  )
}

function WhyDifferent() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <h2 className="text-[#603809] text-3xl md:text-5xl font-bold mb-4">
          Why are we different?
        </h2>
        <p className="text-[#707070] text-base md:text-lg leading-loose">
          Quality has always been our No. 1 priority
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-14">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
      <div className="text-center" data-reveal="up">
        <p className="text-[#707070] text-lg mb-1">
          Born in California, ready for Pakistan
        </p>
        <p className="text-[#603809] text-2xl font-bold mb-6">
          Visit a store near you.
        </p>
        <Button to="/contact">Find a Store</Button>
      </div>
    </section>
  )
}

export default WhyDifferent
