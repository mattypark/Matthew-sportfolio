// The faint world map behind the title, with one dot where he is. Plain
// equirectangular from world-atlas (already a dependency for the old globe),
// computed once; a ring that crosses the date line is split there instead of
// streaking across the map.

import { feature } from 'topojson-client'
import worldTopo from 'world-atlas/countries-110m.json'

const W = 360
const LAT_TOP = 84
const LAT_BOTTOM = -58
const H = LAT_TOP - LAT_BOTTOM

const x = (lon) => lon + 180
const y = (lat) => LAT_TOP - lat

function ringPath(ring) {
  let d = ''
  let prev = null
  for (const [lon, lat] of ring) {
    const jump = prev && Math.abs(lon - prev) > 180
    d += `${!prev || jump ? 'M' : 'L'}${x(lon).toFixed(1)} ${y(lat).toFixed(1)}`
    prev = lon
  }
  return d
}

const LAND = (() => {
  const countries = feature(worldTopo, worldTopo.objects.countries).features
  let d = ''
  for (const c of countries) {
    const { type, coordinates } = c.geometry ?? {}
    const polygons = type === 'Polygon' ? [coordinates] : type === 'MultiPolygon' ? coordinates : []
    for (const poly of polygons) for (const ring of poly) d += ringPath(ring)
  }
  return d
})()

export default function WorldMap({ pin, className }) {
  return (
    <svg className={className} viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path d={LAND} pathLength="1" className="vol-map__land" />
      <circle cx={x(pin.lon)} cy={y(pin.lat)} r={1.3} className="vol-map__ping" />
      <circle cx={x(pin.lon)} cy={y(pin.lat)} r={1.3} className="vol-map__pin" />
    </svg>
  )
}
