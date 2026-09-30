import { Link } from "react-router-dom"
import { useRef } from "react"
import { imgFooterTexture } from "../assets/images"
import { gsap, useGSAP, reducedMotion } from "../lib/gsap"
import { contact } from "../data/contact"

const aboutLinks = [
  { label: "Menu", to: "/menu" },
  { label: "Coffee", to: "/coffee" },
  { label: "Tea", to: "/tea" },
  { label: "About Us", to: "/about" },
  { label: "Contact Us", to: "/contact" },
]

const companyLinks = [
  { label: "Our Heritage", to: "/about" },
  { label: "Our Menu", to: "/menu" },
  { label: "Our Stores", to: "/contact" },
  { label: "Careers", to: "/careers" },
  { label: "Privacy Policy", to: "/privacy-policy" },
]

const socials = [
  {
    label: "Instagram",
    href: contact.instagram,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    href: contact.facebook,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M13.5 22v-8h2.7l.4-3.2h-3.1V8.7c0-.9.3-1.6 1.7-1.6h1.5V4.2c-.3 0-1.2-.1-2.3-.1-2.3 0-3.9 1.4-3.9 4v2.7H7.8V14h2.7v8h3z" />
      </svg>
    ),
  },
]

function Footer() {
  const root = useRef(null)

  useGSAP(
    () => {
      if (reducedMotion()) return
      gsap.from("[data-foot-col]", {
        y: 80,
        opacity: 0,
        rotateX: -30,
        transformPerspective: 900,
        stagger: 0.12,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: root.current, start: "top 85%", once: true },
      })
      gsap.from("[data-social]", {
        scale: 0,
        rotate: -180,
        stagger: 0.08,
        duration: 1,
        ease: "back.out(2)",
        scrollTrigger: { trigger: root.current, start: "top 80%", once: true },
      })

      // End credits: the giant wordmark rises letter by letter as the reel runs out.
      gsap.from("[data-credit-letter]", {
        yPercent: 100,
        rotateX: -60,
        opacity: 0,
        stagger: 0.04,
        ease: "power3.out",
        scrollTrigger: { trigger: "[data-credits]", start: "top bottom", end: "bottom bottom", scrub: 1 },
      })
    },
    { scope: root }
  )

  return (
    <footer ref={root} className="relative bg-[#442808] overflow-hidden pt-20 pb-10">
      <img
        src={imgFooterTexture}
        alt=""
        className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-80 pointer-events-none"
      />
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
        <div data-foot-col>
          <Link to="/" className="font-script text-white text-4xl block mb-4">
            Coffee Bean
          </Link>
          <p className="text-white/70 text-sm leading-relaxed">
            Born and brewed in Southern California, we take pride in the
            experience we provide our customers with our freshest and richest
            blends of tea and coffee.
          </p>
          <div className="flex items-center gap-3 mt-6">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                data-social
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-[#f9c06a] hover:text-[#1e1e1e] hover:-translate-y-1 hover:rotate-[360deg] transition-[background-color,color,translate,rotate] duration-500"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
        <div data-foot-col>
          <h4 className="text-white text-xl font-bold mb-6">About</h4>
          <ul className="text-white/70 text-sm space-y-3">
            {aboutLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="inline-block hover:text-[#f9c06a] hover:translate-x-2 transition-[color,translate] duration-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div data-foot-col>
          <h4 className="text-white text-xl font-bold mb-6">Company</h4>
          <ul className="text-white/70 text-sm space-y-3">
            {companyLinks.map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="inline-block hover:text-[#f9c06a] hover:translate-x-2 transition-[color,translate] duration-300"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div data-foot-col>
          <h4 className="text-white text-xl font-bold mb-6">Contact Us</h4>
          <ul className="text-white/70 text-sm space-y-3">
            <li>{contact.company}</li>
            <li>{contact.phone}</li>
            <li>{contact.email}</li>
            <li>{contact.website}</li>
          </ul>
        </div>
      </div>
      <div data-credits className="relative max-w-7xl mx-auto px-6 md:px-10 mb-10" style={{ perspective: 800 }}>
        <p className="text-[#f9c06a] text-[10px] md:text-xs uppercase tracking-[0.5em] text-center mb-2">
          Simply the Best · Born &amp; Brewed Since 1963
        </p>
        <p
          aria-hidden="true"
          className="font-script text-white/90 text-center leading-none text-[clamp(64px,17vw,240px)] flex justify-center overflow-hidden"
        >
          {"Coffee Bean".split("").map((c, i) => (
            <span key={i} data-credit-letter className="inline-block" style={{ whiteSpace: "pre" }}>
              {c}
            </span>
          ))}
        </p>
      </div>
      <div className="relative max-w-7xl mx-auto px-6 md:px-10 pt-8 border-t border-white/10 text-center text-white/50 text-xs">
        © {new Date().getFullYear()} The Coffee Bean &amp; Tea Leaf Pakistan. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
