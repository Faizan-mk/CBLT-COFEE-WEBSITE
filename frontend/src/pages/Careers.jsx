import PageHero from "../components/PageHero"
import SectionTitle from "../components/SectionTitle"
import Button from "../components/Button"
import { contact } from "../data/contact"
import { stores, storeCities } from "../data/stores"

// The old site's Careers tile linked to an empty Jobs page, so there are no
// listings to show: applicants send their CV instead.
const applyUrl = `mailto:${contact.email}?subject=${encodeURIComponent("Job application")}`

const cities = storeCities.map((city) => ({
  city,
  count: stores.filter((s) => s.city === city).length,
}))

function Careers() {
  return (
    <>
      <PageHero
        title="Careers"
        subtitle="Join The Coffee Bean & Tea Leaf family in Pakistan."
      />

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="relative order-2 md:order-1">
          <div className="rounded-[24px] overflow-hidden aspect-[500/484]">
            <img
              src="/images/cbtl/pages/metro-home/05-careers-beach-coffee-1-550x550.jpg"
              alt="Coffee Bean cup on the beach"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="order-1 md:order-2">
          <h2 className="text-[#603809] text-3xl md:text-5xl font-bold mb-6 leading-tight">
            Work with us
          </h2>
          <p className="text-[#707070] text-base md:text-lg leading-loose mb-6">
            The Coffee Bean &amp; Tea Leaf Pakistan strives to stay true to the
            social Californian lifestyle that our brand so joyously signifies.
            We operate all local Coffee Bean stores ourselves and don’t offer
            franchises, so every team member is part of one family.
          </p>
          <p className="text-[#707070] text-base md:text-lg leading-loose mb-8">
            The people who prepare our coffee at every level are passionate
            about providing ‘Simply the Best’ coffee to our customers. If that
            sounds like you, we’d love to hear from you.
          </p>
          <Button href={applyUrl}>Send Your CV</Button>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-24">
        <SectionTitle
          title="Where we are"
          subtitle={`${stores.length} stores across Pakistan, and growing`}
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cities.map((c, i) => (
            <div
              key={c.city}
              className={`rounded-[16px] p-8 text-center ${
                i === 0 ? "bg-[#ffeed8]" : "bg-[#fff9f1] border border-[#f9c06a]/40"
              }`}
            >
              <p className="font-script text-[#603809] text-5xl mb-2">{c.count}</p>
              <h3 className="text-[#603809] text-xl font-bold mb-1">{c.city}</h3>
              <p className="text-[#707070] text-sm">{c.count === 1 ? "store" : "stores"}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-2xl mx-auto px-6 md:px-10 pb-16 md:pb-24 text-center">
        <p className="text-[#603809] text-2xl md:text-3xl font-bold mb-4">
          No open positions listed right now
        </p>
        <p className="text-[#707070] text-base md:text-lg mb-8">
          Email your CV to {contact.email} and we’ll get in touch when a role
          opens at a store near you.
        </p>
        <Button href={applyUrl}>Send Your CV</Button>
      </section>
    </>
  )
}

export default Careers
