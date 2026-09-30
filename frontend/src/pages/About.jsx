import PageHero from "../components/PageHero"
import SectionTitle from "../components/SectionTitle"
import Button from "../components/Button"
import {
  imgCtaBg,
  imgCoffeeBeansIcon,
  imgBadgeIcon,
  imgCoffeeCupIcon,
  imgBestPriceIcon,
} from "../assets/images"

// Content from coffeebean.pk: About Us, Our Heritage, Coffee Sourcing and Tea Sourcing.
const img = (page, file) => `/images/cbtl/pages/${page}/${file}`

const features = [
  {
    title: "Top 1% Arabica",
    desc: "Only the top 1% of Arabica beans, grown at altitudes up to 6,000 feet",
    icon: imgCoffeeBeansIcon,
    filled: true,
  },
  {
    title: "Small-Batch Roasting",
    desc: "Roasted in small batches at our facility in Camarillo, California",
    icon: imgBadgeIcon,
  },
  {
    title: "Hand-Blended Tea",
    desc: "Whole-leaf teas from family-owned estates, hand-blended for freshness",
    icon: imgCoffeeCupIcon,
  },
  {
    title: "No Middleman",
    desc: "We buy directly from the growers and give back to their communities",
    icon: imgBestPriceIcon,
  },
]

const stats = [
  { value: "1963", label: "Born in Southern California" },
  { value: "1400+", label: "Stores Worldwide" },
  { value: "40", label: "Countries" },
  { value: "2017", label: "Launched in Pakistan" },
]

const heritage = [
  {
    year: "1963",
    text: "Our first store in Southern California opened, where founder Herb Hyman began importing and roasting coffee.",
    img: img("our-heritage", "03-coffee-bean-banners-website-our-heritage-460x300-1.jpg"),
  },
  {
    year: "1970",
    text: "Herb Hyman moved roasting facility to Camarillo and began to establish direct relationships with coffee growers.",
    img: img("our-heritage", "07-coffee-bean-banners-website-our-heritage-460x300-3.jpg"),
  },
  {
    year: "1987",
    text: "History was made when a barista invented the ICE BLENDED® drink at our Westwood, California store.",
    img: img("our-heritage", "10-coffee-bean-banners-website-our-heritage-550x666-5.jpg"),
  },
  {
    year: "1998",
    text: "The Chai Tea Latte launched.",
    img: img("our-heritage", "09-coffee-bean-banners-website-our-heritage-550x666-3.jpg"),
  },
  {
    year: "2005",
    text: "Established the Caring Cup® Global Charity Program.",
    img: img("our-heritage", "06-coffee-bean-banners-website-our-heritage-550x666-2.jpg"),
  },
  {
    year: "2008",
    text: "We hit the 700 store mark.",
    img: img("our-heritage", "13-store-her.jpg"),
  },
  {
    year: "2013",
    text: "The Coffee Bean & Tea Leaf® celebrates its 50th anniversary – Happy Birthday to us!",
    img: img("our-heritage", "15-the-coffee-bean-and-tea-leaf-50th-birthday-malaysia-food-menu-party-pack-2092.jpg"),
  },
  {
    year: "2017",
    text: "The Coffee Bean & Tea Leaf launched in Pakistan.",
    img: img("our-heritage", "16-untitled-1-01.jpg"),
  },
]

const sourcing = [
  {
    title: "Coffee Sourcing",
    img: img("coffee-sourcing", "03-coffee-bean-banners-website-sourcing-650x420-1.jpg"),
    alt: "Coffee beans being roasted",
    paragraphs: [
      "Our coffee master, Jay Isais, only selects the top 1% of Arabica beans from the world’s best growing regions in East Africa, Latin America, and the Pacific.",
      "We roast in small batches at our facility in Camarillo, CA, where we find the roast that best suits the beans from each origin and captures what makes each country’s coffee unique. In other words, we don’t do anything halfway.",
      "From the ship to shore, to the lab where our great taste is born, small batches of our fresh green coffee beans are roasted to perfection and analyzed for fragrance, aroma, flavor, acidity, body and finish.",
    ],
  },
  {
    title: "Tea Sourcing",
    img: img("tea-sourcing", "03-coffee-bean-banners-website-tea-sourcing-800x494-3.jpg"),
    alt: "Tea plantation",
    paragraphs: [
      "When our tea master David DeCandia became the Tea Ambassador of Sri Lanka, we figured we were doing something right. David works directly with private, family-owned tea estates to cultivate the best tea leaves from Sri Lanka, China, Thailand, Japan and India — then we hand-blend them locally for maximum freshness.",
      "On the road to tea perfection, we insist on staying connected to the harvest by purchasing directly from the growers – without middlemen, wholesalers, or importer-exporters. It’s not only the right thing to do, it allows us to source and deliver the world’s finest, most distinctive teas.",
    ],
  },
]

function About() {
  return (
    <>
      <PageHero
        title="About Us"
        subtitle="Born & brewed in Southern California since 1963. We take pride in serving our freshest and richest blends of tea and coffee."
      />

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 md:order-1">
          <div className="rounded-[24px] overflow-hidden aspect-[500/484]">
            <img
              src={img("our-heritage", "12-store-her-1.jpg")}
              alt="Born and brewed in Southern California since 1963"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-[#603809] text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Our story
          </h2>
          <p className="text-[#707070] text-base md:text-lg leading-loose mb-6">
            Born &amp; brewed in Southern California since 1963, Herbert B.
            Hyman started The Coffee Bean &amp; Tea Leaf. Hyman’s effort in
            serving the best coffee and tea in the world made him the founding
            father of gourmet coffee in California. Now, over 50 years later,
            The Coffee Bean &amp; Tea Leaf has grown into one of the largest
            privately-owned, family-run coffee and tea companies in the world.
          </p>
          <p className="text-[#707070] text-base md:text-lg leading-loose mb-8">
            The Coffee Bean &amp; Tea Leaf® has since grown to over 1400 stores
            in nearly 40 countries worldwide — from California to New York,
            and across Asia, the Middle East and Latin America, including
            Pakistan.
          </p>
          <Button to="/contact">Visit Us</Button>
        </div>
      </section>

      <section className="relative overflow-hidden py-16 md:py-24">
        <img src={imgCtaBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#603809] opacity-80" />
        <div className="relative max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="font-script text-white text-5xl md:text-6xl mb-2">
                  {s.value}
                </p>
                <p className="text-white/85 text-sm md:text-base font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24">
        <SectionTitle
          title="Our Heritage"
          subtitle="More than 50 years of serving the perfect cup"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {heritage.map((h) => (
            <div
              key={h.year}
              className="bg-[#fff9f1] border border-[#f9c06a]/40 rounded-[16px] overflow-hidden flex flex-col"
            >
              <img src={h.img} alt="" className="w-full h-[180px] object-cover" />
              <div className="p-6 text-center">
                <p className="font-script text-[#603809] text-4xl mb-2">{h.year}</p>
                <p className="text-[#707070] text-sm leading-relaxed">{h.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {sourcing.map((s, i) => (
        <section
          key={s.title}
          className="max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-24 grid md:grid-cols-2 gap-12 items-center"
        >
          <div className={`relative order-2 ${i % 2 ? "md:order-2" : "md:order-1"}`}>
            <div className="rounded-[24px] overflow-hidden aspect-[500/484]">
              <img src={s.img} alt={s.alt} className="w-full h-full object-cover" />
            </div>
          </div>
          <div className={`order-1 ${i % 2 ? "md:order-1" : "md:order-2"}`}>
            <h2 className="text-[#603809] text-3xl md:text-5xl font-bold mb-6 leading-tight">
              {s.title}
            </h2>
            {s.paragraphs.map((p) => (
              <p key={p} className="text-[#707070] text-base md:text-lg leading-loose mb-6 last:mb-0">
                {p}
              </p>
            ))}
          </div>
        </section>
      ))}

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-24">
        <SectionTitle
          title="Why are we different?"
          subtitle="We don't do anything halfway"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className={`rounded-[16px] p-8 text-center ${
                f.filled
                  ? "bg-[#ffeed8]"
                  : "bg-[#fff9f1] border border-[#f9c06a]/40"
              }`}
            >
              <img
                src={f.icon}
                alt=""
                className="w-[72px] h-[72px] object-cover mx-auto mb-6"
              />
              <h3 className="text-[#603809] text-xl font-bold mb-2">
                {f.title}
              </h3>
              <p className="text-[#707070] text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 md:px-10 pb-16 md:pb-24">
        <SectionTitle
          title="Coffee Bean Pakistan"
          subtitle="Staying true to the social Californian lifestyle"
        />
        <div className="bg-[#fff9f1] border border-[#f9c06a]/40 rounded-[24px] px-6 sm:px-16 py-14 relative text-center">
          <span className="font-script text-[#603809] text-[90px] leading-[0.5] absolute left-8 top-6 select-none">
            "
          </span>
          <p className="text-[#707070] text-base md:text-lg leading-loose mb-8 relative z-10">
            The Coffee Bean &amp; Tea Leaf Pakistan strives to stay true to the
            social Californian lifestyle that our brand so joyously signifies.
            This is why we operate all local Coffee Bean stores ourselves and
            don’t offer franchises. We wanna make sure that each cup you sip is
            equally enriched in goodness!
          </p>
          <div className="flex items-center justify-center gap-4">
            <img
              src="/images/cbtl/site/logo.png"
              alt="The Coffee Bean & Tea Leaf"
              className="w-16 h-16 rounded-2xl object-contain bg-white p-1 shadow-[0px_6px_12px_0px_rgba(249,192,106,0.3)]"
            />
            <div className="text-left">
              <p className="text-[#603809] font-bold text-lg">The Coffee Bean &amp; Tea Leaf</p>
              <p className="text-[#707070] text-sm">Pakistan · Ab Brands Pvt Ltd</p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default About
