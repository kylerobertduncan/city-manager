/* https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage */
const localStorageName = "prince";

/* geojson types npm package: https://www.npmjs.com/package/@types/geojson */

interface PointFeature {
  type: "Feature",
  geometry: {
    type: "Point",
    coordinates: [ number, number ]
  },
  properties: {}
}

interface FeatureCollection {
  type: "FeatureCollection",
  features: PointFeature[]
}

function setupLocalStorage() {
  // create an empty data object
  const emptyData: FeatureCollection = {
    type: "FeatureCollection",
    features: []
  }
  // add the (stringified) empty data to local storage
  localStorage.setItem(localStorageName, JSON.stringify(emptyData));
  // retrieve the data to ensure it's been stored
  const dataInStorage = localStorage.getItem(localStorageName);
  // if data is present, parse and return
  if (dataInStorage) return JSON.parse(dataInStorage)
  // otherwise throw and error, and send empty data object as a fallback
  else console.error("Data not stored in localStorage");
}

export function getLocalStorage() {
  const existingData = localStorage.getItem(localStorageName);
  if (existingData) return JSON.parse(existingData);
  else {
    const newData = setupLocalStorage();
    if (newData) return JSON.parse(newData);
  }
}

// add a test to check that new localStorage matches updated object?
function updateLocalStorage(f: FeatureCollection) {
  localStorage.setItem(localStorageName, JSON.stringify(f));
  console.log("localStorage updated:", f);
}

export function addPointFeature(c:{lng:number, lat:number}) {
  const p: PointFeature ={
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [ c.lng, c.lat ]
    },
    properties: {}
  }
  const s: FeatureCollection = getLocalStorage();
  s.features.push(p);
  updateLocalStorage(s);
}

// export function addFeature(f:Feature) {}
