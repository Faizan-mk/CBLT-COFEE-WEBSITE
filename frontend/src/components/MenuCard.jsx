import { useCallback, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import Button from "./Button"
import { useTilt } from "../lib/usePointerFx"
import { gsap, reducedMotion } from "../lib/gsap"
import { pauseScroll, resumeScroll } from "../lib/smoothScroll"

function MenuCard({ name, desc, price, img, badge, category }) {
  const card = useRef(null)
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  useTilt(card)

  // Outer div belongs to the grid's scroll reveal; the inner one owns the hover tilt.
  return (
    <div className="h-full">
      <div
        ref={card}
        className="relative h-full bg-[#fff9f1] border border-[#f9c06a]/40 rounded-[16px] overflow-hidden flex flex-col shadow-[0_10px_30px_rgba(96,56,9,0.08)] hover:shadow-[0_30px_60px_rgba(96,56,9,0.25)] transition-shadow duration-500"
      >
        <div className="overflow-hidden">
          <img
            src={img}
            alt={name}
            className="w-full h-[180px] object-cover scale-110 hover:scale-125 transition-transform duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)]"
          />
        </div>
        {badge && (
          <span className="absolute top-3 left-3 bg-[#f9c06a] text-[#1e1e1e] text-xs font-bold px-3 py-1 rounded-full" style={{ transform: "translateZ(40px)" }}>
            {badge}
          </span>
        )}
        <div className="p-6 flex flex-col items-center text-center gap-2 flex-1" style={{ transform: "translateZ(30px)" }}>
          <h3 className="text-[#603809] text-xl font-bold">{name}</h3>
          <p className="text-[#603809] text-lg font-bold mb-2 mt-auto">{price}</p>
          <Button type="button" onClick={() => setOpen(true)} className="w-full">
            Details
          </Button>
        </div>
        <div data-glare className="absolute inset-0 pointer-events-none opacity-0 mix-blend-overlay" />
      </div>
      {open && (
        <MenuDetails
          name={name}
          desc={desc}
          price={price}
          img={img}
          category={category}
          onClose={close}
        />
      )}
    </div>
  )
}

function MenuDetails({ name, desc, price, img, category, onClose }) {
  const overlay = useRef(null)
  const panel = useRef(null)

  useEffect(() => {
    pauseScroll()
    document.body.style.overflow = "hidden"
    const onKey = (e) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    if (!reducedMotion()) {
      gsap.fromTo(overlay.current, { opacity: 0 }, { opacity: 1, duration: 0.3 })
      gsap.fromTo(panel.current, { y: 40, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "expo.out" })
    }
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      resumeScroll()
    }
  }, [onClose])

  // Portal to <body>: the card's tilt transform would otherwise trap position:fixed.
  return createPortal(
    <div
      ref={overlay}
      onClick={onClose}
      className="fixed inset-0 z-[90] bg-[#1e140a]/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label={name}
        data-lenis-prevent
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[#fff9f1] border border-[#f9c06a]/40 rounded-[24px] shadow-[0_30px_60px_rgba(96,56,9,0.35)]"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-3 right-3 z-10 w-10 h-10 rounded-full bg-[#fff9f1] text-[#603809] font-bold text-xl shadow-[0_6px_12px_rgba(96,56,9,0.2)] hover:bg-[#f9c06a] transition-colors"
        >
          ×
        </button>
        <img src={img} alt={name} className="w-full h-[260px] object-cover" />
        <div className="p-8 flex flex-col items-center text-center gap-3">
          {category && (
            <span className="bg-[#f9c06a] text-[#1e1e1e] text-xs font-bold px-3 py-1 rounded-full">{category}</span>
          )}
          <h3 className="text-[#603809] text-2xl md:text-3xl font-bold">{name}</h3>
          {desc && <p className="text-[#1e1e1e] text-base leading-loose">{desc}</p>}
          {price && <p className="text-[#603809] text-xl font-bold">{price}</p>}
        </div>
      </div>
    </div>,
    document.body
  )
}

export default MenuCard
