// import third party packages
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { useEffect, useRef, useState } from "react";
import { bbox, centerOfMass } from "@turf/turf";
// import local components
import Sidebar from "../components/Sidebar";
// import other local elements
import { GeojsonController } from "../modules/geojsonController";
import { getLocalStorage, setLocalStorage } from "../modules/localStorage";
import { mapboxInit, MapController } from "../modules/mapController";
import { emptyFeatureCollection, emptyFeatureProperties, featureProperties, localStorageId, mapboxSourceId } from "../variables";

export default function Root() {
  // setup geojson controller
  const geojson: any = useRef(null);
	// setup map controller,  object and container
	const map: any = useRef(null);
	const mapbox: any = useRef(null);
	const mapContainer: any = useRef(null);
	// setup state for changable map properties
	const [center, setCenter] = useState<mapboxgl.LngLatLike>({ lng: -79.37, lat: 43.65 });
	const [zoom, setZoom] = useState(12);
	// setup state for local storage geojson object
	const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection>(emptyFeatureCollection);

	// load initial data from local storage and run mapbox setup
	useEffect(() => {
    const data = getLocalStorage();
    if (data) {
      setGeojsonData(data);
      geojson.current = new GeojsonController(data, setGeojsonData);
    }
		mapboxSetup();
	}, []);

	function mapboxSetup() {
		// if no map, initialise new map
		if (!mapbox.current) mapbox.current = mapboxInit(center, mapContainer.current, setCenter, setZoom, zoom);
		// if no controller, initialise new controller
		if (!map.current) map.current = new MapController(mapbox.current);
		// if map not loaded, re-run when loaded
		if (!mapbox.current.loaded()) mapbox.current.on("load", mapboxSetup);
		if (!mapbox.current.isStyleLoaded()) return;
		// load initial source and layers
		map.current.setupSource(geojsonData);
    // map.current.addLayers(); // incorporated into setupSource
    mapbox.current.once("idle", onPageLoad);
  }
  
  function onPageLoad() {
    // is there more elegant way to fire when the map/source is loaded?
    setTimeout(() => {
      if (!geojsonData.features.length) return;
      // add search for new city feature here
			map.current.goToBounds(bbox(geojsonData) as mapboxgl.LngLatBoundsLike);
    }, 500)
	}

	// handle updates to geojsonData:
	// - saves the geojson to local storage
	// - updates the mapbox source data
	useEffect(() => {
		// prevents overwriting localStorage with empty collection on page load
		if (!geojsonData.features.length && !map.current.isSourceLoaded()) return;
		// update localStorage
    setLocalStorage(geojsonData);
		// update mapbox source data
    map.current.updateSource(geojsonData);
	}, [geojsonData]);

	return (
		<Grid container className='App'>
			{/* map Window */}
			<Grid component='main' item xs={12} md={8} lg={9} sx={{ position: "relative" }}>
				{/* mapbox container */}
        <Box className='map-container' component='div' height='100dvh' ref={mapContainer} />
        {/* toolbar */}
      </Grid>
      {/* sidebar */}
      <Sidebar geojsonData={geojsonData} map={map.current} />
      {/* dialog(s) */}
		</Grid>
	);
}
