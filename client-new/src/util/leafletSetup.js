// Fixes Leaflet's default marker icon in production builds.
//
// Leaflet auto-detects its marker image paths from the bundled CSS. After Vite
// content-hashes asset filenames for production, that detection resolves to a
// non-existent URL like /assets/marker-icon.png — the Express server then answers
// with index.html (200), so the image "loads" in the network tab but renders as a
// broken image with the default "Marker" alt text. Works in dev (unhashed paths),
// breaks once built. Importing the images explicitly hands Leaflet the correct
// hashed URLs. Imported once from main.jsx so it applies to every map.
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})
