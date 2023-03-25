import 'ol/ol.css';
import {Map, View, Overlay} from 'ol'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import {OSM, Vector as VectorSource} from 'ol/source'
import {GeoJSON} from 'ol/format'
import {Style, Stroke, Fill, Icon, Circle} from 'ol/style'

const STROKES = [
  '#FF0000',
  '#FFA500',
  '#FFFF00',
  '#00FF00',
  '#008000',
  '#00BFFF'
]

const FILLS = [
  '#A52A2A',
  '#D3D3D3',
  '#BDB76B',
  '#32CD32',
  '#0000FF',
  '#FFA500'
]

function getRandom(type) {
  return type[Math.floor(Math.random() * type.length)]
}

document.addEventListener("DOMContentLoaded", function(event) { 
  setTimeout(function() {
    
  }, 0)
});

const container = document.getElementById('popup');
const content = document.getElementById('popup-content');
const closer = document.getElementById('popup-closer');

const overlay = new Overlay({
  element: container
})

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM({
        "url": "http://tile.openstreetmap.org/{z}/{x}/{y}.png"
      })
    })
  ],
  view: new View({
    center: [0, 0],
    zoom: 2
  }),
  overlays: [overlay],
})

const source = new VectorSource({
  url: 'data.json',
  format: new GeoJSON(),
})

// const pStyle = new Style({
//   image: new Icon({
//     src: 'https://www.freepnglogos.com/uploads/pin-png/location-pin-connectsafely-37.png',
//     size: [800, 800],
//     scale: 0.05
//   })
// })

const pStyle = (point) => {
  // console.log(point.getProperties());
  return new Style({
    image: new Circle({
      radius: 8,
      fill: new Fill({
        color: getRandom(FILLS),
      }),
      stroke: new Stroke({
        color: getRandom(STROKES),
        width: 2,
      }),
    }),
  })
}

const points = new VectorLayer({
  source,
  style: pStyle
})

map.addLayer(points)

source.on('change', (e) => {
  // console.log(e)
  // console.log(points.getSource().getExtent())
  map.getView().fit(points.getSource().getExtent(), map.getSize());
})

map.on('pointermove', (e) => {
  let feature = map.forEachFeatureAtPixel(e.pixel, (feature, layer) => {
    if (layer == points) {
      return feature
    }
  })
  if (feature) {
    let popupContent = `<h3>${feature.get('company')}</h3><p>${feature.get('date')}</p><p>${feature.get('address')}</p><p>${feature.get('phone')}</p>`
    content.innerHTML = popupContent
    const coordinate = e.coordinate
    // console.log(feature, coordinate)
    overlay.setPosition(coordinate)
  } else {
    overlay.setPosition(undefined)
  }
})

// closer.onclick = () => {
//   overlay.setPosition(undefined)
//   closer.blur()
//   return false
// }
