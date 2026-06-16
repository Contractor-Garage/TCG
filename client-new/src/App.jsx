// Root component — sets up client-side routing with React Router.
// Nav, Footer, and ScrollToTop are rendered outside <Routes> so they run on every page.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Locations from './pages/Locations'
import BrandWithUs from './pages/BrandWithUs'
import LocationDetail from './pages/LocationDetail'
import PrivacyPolicy from './pages/PrivacyPolicy'

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/directory" element={<Locations />} />
        <Route path="/development-services" element={<BrandWithUs />} />
        <Route path="/location/:slug" element={<LocationDetail />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        {/* Catch-all: unknown routes redirect home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  )
}
