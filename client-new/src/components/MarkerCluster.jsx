import { useEffect } from 'react'
import { useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet.markercluster'

export default function MarkerCluster({ markers }) {
  const map = useMap()

  useEffect(() => {
    const cluster = L.markerClusterGroup()

    markers.forEach(({ position, popup }) => {
      const marker = L.marker(position)
      if (popup) marker.bindPopup(popup)
      cluster.addLayer(marker)
    })

    map.addLayer(cluster)
    return () => {
      map.removeLayer(cluster)
    }
  }, [map, markers])

  return null
}
