// Store locations from the coffeebean.pk store locator (see ./cbtl/stores.js).
import { stores as allStores } from "./cbtl/stores"

const DAYS = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]
const DAY_LABELS = { mon: "Mon", tue: "Tue", wed: "Wed", thu: "Thu", fri: "Fri", sat: "Sat", sun: "Sun" }

// "08:00 AM - 01:00 AM" -> "8 AM – 1 AM"; "0" means closed on the old site.
function formatTime(value) {
  if (!value || value === "0") return "Closed"
  if (value === "12:00 AM - 11:59 PM") return "Open 24 hours"
  return value
    .replace(/\b0?(\d{1,2}):00\s?(AM|PM)/gi, "$1 $2")
    .replace(/\b0(\d):(\d\d)/g, "$1:$2")
    .replace(/\s*-\s*/, " – ")
}

// Collapse the week into runs of days that share the same hours:
// [{ days: "Mon – Fri", time: "8 AM – 1 AM" }, { days: "Sat – Sun", time: "9 AM – 1 AM" }]
export function openingHours(hours) {
  const runs = []
  for (const day of DAYS) {
    const time = formatTime(hours[day])
    const last = runs[runs.length - 1]
    if (last && last.time === time) last.to = day
    else runs.push({ from: day, to: day, time })
  }
  if (runs.length === 1) return [{ days: "Every day", time: runs[0].time }]
  return runs.map((r) => ({
    days: r.from === r.to ? DAY_LABELS[r.from] : `${DAY_LABELS[r.from]} – ${DAY_LABELS[r.to]}`,
    time: r.time,
  }))
}

export const stores = [...allStores].sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name))

// Cities with the most stores first.
const countByCity = stores.reduce((acc, s) => ({ ...acc, [s.city]: (acc[s.city] || 0) + 1 }), {})
export const storeCities = Object.keys(countByCity).sort(
  (a, b) => countByCity[b] - countByCity[a] || a.localeCompare(b)
)

export const directionsUrl = (store) =>
  `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`
