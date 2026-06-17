// Root component — sets up client-side routing with React Router.
// Nav, Footer, and ScrollToTop are rendered outside <Routes> so they run on every page.
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MapProvider } from './context/MapContext'
import Nav from './components/Nav'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import Home from './pages/Home'
import About from './pages/About'
import Locations from './pages/Locations'
import BrandWithUs from './pages/BrandWithUs'
import LocationDetail from './pages/LocationDetail'
import LocationPreview from './pages/LocationPreview'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

export default function App() {
  return (
    <MapProvider>
      <BrowserRouter>
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#CC6633] focus:text-white focus:px-4 focus:py-2 focus:font-bold">
          Skip to content
        </a>
        <ScrollToTop />
        <Nav />
        <div id="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about-us" element={<About />} />
            <Route path="/directory" element={<Locations />} />
            <Route path="/development-services" element={<BrandWithUs />} />
            <Route path="/location/preview/:id" element={<LocationPreview />} />
            <Route path="/location/:slug" element={<LocationDetail />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-service" element={<TermsOfService />} />
            {/* Catch-all: unknown routes redirect home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </MapProvider>
  )
}
