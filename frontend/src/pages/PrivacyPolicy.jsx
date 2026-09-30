import PageHero from "../components/PageHero"
import { pages } from "../data/cbtl/pages"

// Privacy policy text from coffeebean.pk, rendered from the scraped blocks.
// The title and tagline are already shown in the hero, so the first two headings are skipped.
const blocks = pages["privacy-policy"].blocks.slice(2)

// Group consecutive list items so they render as one <ul>.
const groups = blocks.reduce((acc, b) => {
  const last = acc[acc.length - 1]
  if (b.type === "list_item" && last?.type === "list") last.items.push(b.text)
  else if (b.type === "list_item") acc.push({ type: "list", items: [b.text] })
  else acc.push(b)
  return acc
}, [])

function PrivacyPolicy() {
  return (
    <>
      <PageHero title="Privacy Policy" subtitle="We respect your privacy." />
      <section className="max-w-4xl mx-auto px-6 md:px-10 py-16 md:py-24">
        {groups.map((b, i) => {
          if (b.type === "heading")
            return (
              <h2 key={i} className="text-[#603809] text-2xl md:text-3xl font-bold mt-10 mb-4 first:mt-0">
                {b.text}
              </h2>
            )
          if (b.type === "list")
            return (
              <ul key={i} className="list-disc pl-6 mb-6 space-y-2 marker:text-[#f9c06a]">
                {b.items.map((t) => (
                  <li key={t} className="text-[#707070] text-base leading-loose">
                    {t}
                  </li>
                ))}
              </ul>
            )
          if (b.type === "text")
            return (
              <p key={i} className="text-[#707070] text-base leading-loose mb-4">
                {b.text}
              </p>
            )
          return null
        })}
      </section>
    </>
  )
}

export default PrivacyPolicy
