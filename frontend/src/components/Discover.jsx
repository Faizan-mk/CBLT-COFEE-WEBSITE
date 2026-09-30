import { imgDiscover } from "../assets/images"
import Button from "./Button"

function Discover() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
      <div data-reveal="left">
        <h2 className="text-[#603809] text-3xl md:text-5xl font-bold mb-6 leading-tight">
          Discover the best coffee
        </h2>
        <p className="text-[#707070] text-base md:text-lg leading-loose mb-8">
          Herbert B. Hyman started The Coffee Bean &amp; Tea Leaf in 1963, with
          the commitment to serve the perfect cup. Now, over 50 years later, the
          company has fulfilled its promise by becoming one of the world’s
          largest privately-owned coffee and tea companies.
        </p>
        <Button to="/about">Learn More</Button>
      </div>
      <div className="relative">
        <div data-clip className="rounded-[24px] overflow-hidden aspect-[500/484]">
          <img
            data-parallax="0.12"
            src={imgDiscover}
            alt="Stylized coffee cup and beans"
            className="w-full h-full object-cover mix-blend-multiply scale-125"
          />
        </div>
      </div>
    </section>
  )
}

export default Discover
