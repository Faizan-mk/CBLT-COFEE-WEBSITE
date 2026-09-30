import { useState } from "react"
import PageHero from "../components/PageHero"
import Button from "../components/Button"
import SectionTitle from "../components/SectionTitle"
import { supabase } from "../lib/supabase"
import { contact } from "../data/contact"
import { stores, storeCities, openingHours, directionsUrl } from "../data/stores"

const contactInfo = [
  {
    title: "Visit Us",
    lines: [`${stores.length} stores across Pakistan`, `${storeCities.join(", ")}`],
  },
  {
    title: "Call Us",
    lines: [contact.phone, "Feedback & queries"],
  },
  {
    title: "Email Us",
    lines: [contact.email, contact.website],
  },
  {
    title: "Follow Us",
    lines: ["Facebook: CoffeeBeanPakistan", "Instagram: @coffeebeanpakistan"],
  },
]

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [sent, setSent] = useState(false)
  const [city, setCity] = useState(storeCities[0])
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!supabase) {
      setSent(true)
      return
    }
    setBusy(true)
    setError("")
    const { error: insertError } = await supabase
      .from("contact_messages")
      .insert(form)
    setBusy(false)
    if (insertError) {
      setError(insertError.message)
    } else {
      setSent(true)
    }
  }

  const inputClass =
    "w-full bg-[#fff9f1] border border-[#f9c06a]/40 rounded-[8px] px-4 py-3 text-[#1e1e1e] placeholder-[#707070] outline-none focus:border-[#f9c06a] transition-colors"

  return (
    <>
      <PageHero
        title="Contact Us"
        subtitle="At The Coffee Bean & Tea Leaf, we care about what you have to say."
      />

      <section className="max-w-7xl mx-auto px-6 md:px-10 py-16 md:py-24 grid lg:grid-cols-2 gap-12">
        <div>
          <h2 className="text-[#603809] text-3xl md:text-4xl font-bold mb-4">
            Get in touch
          </h2>
          <p className="text-[#707070] text-base md:text-lg leading-loose mb-10">
            Simply drop us a message if you have any feedback or query, and we
            will get back to you as soon as possible.
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {contactInfo.map((info) => (
              <div
                key={info.title}
                className="bg-[#fff9f1] border border-[#f9c06a]/40 rounded-[16px] p-6"
              >
                <h3 className="text-[#603809] text-lg font-bold mb-3">
                  {info.title}
                </h3>
                {info.lines.map((line) => (
                  <p key={line} className="text-[#707070] text-sm leading-relaxed">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#fff9f1] border border-[#f9c06a]/40 rounded-[24px] p-8 md:p-10">
          {sent ? (
            <div className="text-center py-16">
              <p className="font-script text-[#603809] text-6xl mb-4">Thank you!</p>
              <p className="text-[#707070] text-lg mb-8">
                Your message has been sent. We'll get back to you soon.
              </p>
              <Button onClick={() => setSent(false)}>Send another</Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Your name"
                  className={inputClass}
                />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="Your email"
                  className={inputClass}
                />
              </div>
              <input
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Subject"
                className={inputClass}
              />
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                placeholder="Your message"
                rows="6"
                className={`${inputClass} resize-none`}
              />
              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-[8px] px-3 py-2">
                  {error}
                </p>
              )}
              <Button className="w-max" disabled={busy}>
                {busy ? "Sending…" : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 md:px-10 pb-16 md:pb-24">
        <SectionTitle title="Our Stores" subtitle="Visit the outlet near you" />
        <div className="flex flex-wrap justify-center gap-4 mb-14">
          {storeCities.map((c) => (
            <button
              key={c}
              onClick={() => setCity(c)}
              className={`px-6 py-3 rounded-full font-bold text-sm transition-colors ${
                city === c
                  ? "bg-[#f9c06a] text-[#1e1e1e] shadow-[0px_6px_12px_0px_rgba(249,192,106,0.35)]"
                  : "bg-[#fff9f1] border border-[#f9c06a]/40 text-[#603809] hover:bg-[#ffeed8]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {stores
            .filter((s) => s.city === city)
            .map((s) => (
              <div
                key={s.id}
                className="bg-[#fff9f1] border border-[#f9c06a]/40 rounded-[16px] p-6 flex flex-col"
              >
                <h3 className="text-[#603809] text-lg font-bold mb-2">{s.name}</h3>
                {s.address && s.address !== s.name && (
                  <p className="text-[#707070] text-sm leading-relaxed">{s.address}</p>
                )}
                {s.phone && (
                  <a
                    href={`tel:${s.phone.replace(/[^\d+]/g, "")}`}
                    className="text-[#707070] text-sm leading-relaxed hover:text-[#603809]"
                  >
                    {s.phone}
                  </a>
                )}
                <div className="mt-4 pt-4 border-t border-[#f9c06a]/40 space-y-1 mb-4">
                  {openingHours(s.hours).map((h) => (
                    <p key={h.days} className="flex justify-between gap-4 text-sm">
                      <span className="text-[#707070]">{h.days}</span>
                      <span className="text-[#1e1e1e] font-bold">{h.time}</span>
                    </p>
                  ))}
                </div>
                {s.lat && (
                  <a
                    href={directionsUrl(s)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto text-[#603809] font-bold text-sm underline underline-offset-4 hover:text-[#f9c06a]"
                  >
                    Get Directions
                  </a>
                )}
              </div>
            ))}
        </div>
      </section>
    </>
  )
}

export default Contact
