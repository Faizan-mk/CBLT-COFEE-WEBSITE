import { lazy, Suspense, useEffect } from "react"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import Layout from "./components/Layout"
import ScrollToTop from "./components/ScrollToTop"
import Home from "./pages/Home"
import Menu from "./pages/Menu"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Careers from "./pages/Careers"
import ProductRange from "./pages/ProductRange"
import { coffees, teas } from "./data/shop"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import ResetPassword from "./pages/ResetPassword"
import NotFound from "./pages/NotFound"

// Loaded on demand: it carries the long policy text.
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"))

const titles = {
  "/": "The Coffee Bean & Tea Leaf Pakistan",
  "/menu": "Menu — The Coffee Bean & Tea Leaf",
  "/coffee": "Coffee — The Coffee Bean & Tea Leaf",
  "/tea": "Tea — The Coffee Bean & Tea Leaf",
  "/about": "About Us — The Coffee Bean & Tea Leaf",
  "/contact": "Contact Us — The Coffee Bean & Tea Leaf",
  "/careers": "Careers — The Coffee Bean & Tea Leaf",
  "/privacy-policy": "Privacy Policy — The Coffee Bean & Tea Leaf",
  "/signin": "Sign In — The Coffee Bean & Tea Leaf",
  "/signup": "Sign Up — The Coffee Bean & Tea Leaf",
  "/reset-password": "Reset Password — The Coffee Bean & Tea Leaf",
}

function PageTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    document.title = titles[pathname] ?? "The Coffee Bean & Tea Leaf"
  }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <PageTitle />
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route
            path="/coffee"
            element={
              <ProductRange
                key="coffee"
                title="Our Coffee"
                subtitle="Only the top 1% of Arabica beans from East Africa, Latin America and the Pacific, roasted in small batches."
                items={coffees}
              />
            }
          />
          <Route
            path="/tea"
            element={
              <ProductRange
                key="tea"
                title="Our Tea"
                subtitle="Whole-leaf teas from family-owned estates in Sri Lanka, China, Thailand, Japan and India."
                items={teas}
              />
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/privacy-policy" element={<Suspense><PrivacyPolicy /></Suspense>} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
