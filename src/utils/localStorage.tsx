/* https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage */

// setup listener to trigger update on change to local storage

const localStorageName = "prince";

function setupLocalStorage() {
  // create an empty data object
  const emptyData: GeoJSON.FeatureCollection = {
    type: "FeatureCollection",
    features: []
  }
  console.log("empty data:", emptyData);
  
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
  if (existingData) {
    return JSON.parse(existingData)
  } else {
    const newData = setupLocalStorage();
    console.log(newData);
    
    if (newData) return JSON.parse(newData);
  }
}

// add a test to check that new localStorage matches updated object?
function updateLocalStorage(f: GeoJSON.FeatureCollection) {
  localStorage.setItem(localStorageName, JSON.stringify(f));
  console.log("localStorage updated:", f);
}

export function addPointFeature(c:{lng:number, lat:number}) {
  if (c.lng == 0 || c.lat == 0) {
    console.error("Received coordinates:", c);
    return;
  }
  const p: GeoJSON.Feature ={
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: [ c.lng, c.lat ]
    },
    properties: {}
  }
  const s: GeoJSON.FeatureCollection = getLocalStorage();
  s.features.push(p);
  updateLocalStorage(s);
}

// export function addFeature(f:Feature) {}

export function clearLocalStorage() {
  const confirmed = window.confirm("This will erase all your data. Are you sure you want to continue?")
  if (confirmed) localStorage.clear();
  setupLocalStorage();
}

export function filterLocalStorage() {
  const s = getLocalStorage();
  
}
