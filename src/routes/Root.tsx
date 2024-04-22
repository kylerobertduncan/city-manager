// import third party packages
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useEffect, useRef, useState } from 'react';
import { bbox, centerOfMass } from "@turf/turf";
// import local components
import Sidebar from '../components/Sidebar';
import Toolbar from '../components/Toolbar';
// import other local elements
import { getLocalStorage, setLocalStorage } from "../modules/localStorage";
import { mapboxInit, MapController } from '../modules/mapController';
import { emptyFeatureCollection } from '../variables';

export default function Root() {
	// setup map controller,  object and container
	const map: any = useRef(null);
	const mapbox: any = useRef(null);
	const mapContainer: any = useRef(null);
	// setup state for changable map properties
	const [center, setCenter] = useState<mapboxgl.LngLatLike>({ lng: -79.37, lat: 43.65 });
	const [zoom, setZoom] = useState(12);
	// setup geojsonData in state
  const [geojsonData, setGeojsonData] = useState(emptyFeatureCollection);

	// setup mapbox on initial render
	useEffect(mapboxSetup, []);

  function mapboxSetup() {
    const localData = getLocalStorage();
    if (localData) setGeojsonData(localData);
    // if no map, initialise new map
		if (!mapbox.current) mapbox.current = mapboxInit(center, mapContainer.current, setCenter, setZoom, zoom);
		// if map not loaded, re-run when loaded
		if (!mapbox.current.loaded()) mapbox.current.on('load', mapboxSetup);
		if (!mapbox.current.isStyleLoaded()) return;
		// if no controller, initialise new controller
		if (!map.current) map.current = new MapController(mapbox.current);
		// load initial source and layers
		map.current.setupSource(geojsonData);
		// why does this keep firing?
		// re-renders from setup useEffect when all dependencies are added
		// also seems to break featureCard easeTo ??
		mapbox.current.once("idle", onPageLoad);
	}

  function onPageLoad() {
    // because there's no data on initial load, it doesn't fire except on page refresh
		if (!geojsonData.features.length) return;
		// add search for new city feature here
		else map.current.goToBounds(bbox(geojsonData) as mapboxgl.LngLatBoundsLike);
	}

	// handle updates to geojsonData:
	// - saves the geojson to local storage
	// - updates the mapbox source data
	useEffect(() => {
		// prevents overwriting localStorage with empty collection on page load
		if (!geojsonData.features.length && !map.current?.isSourceLoaded()) return;
		// update localStorage
		setLocalStorage(geojsonData);
		// update mapbox source data
    if (map.current) map.current.updateSource(geojsonData);
  }, [geojsonData]);

  /* geojson handlers */

  function getCenter(geometry: GeoJSON.Geometry) {
    if (geometry.type === "Point") return geometry.coordinates;
    if (geometry.type === "Polygon") return centerOfMass(geometry);
  }

  function handleAddFeature(newFeature: GeoJSON.Feature) {
    if (!newFeature.properties) return;
    if (!newFeature.properties.center) newFeature.properties.center = getCenter(newFeature.geometry);
    if (newFeature.geometry.type === "Polygon") newFeature.properties.bbox = bbox(newFeature.geometry);
    const updatedData = { ...geojsonData }
    updatedData.features.push(newFeature);
    setGeojsonData(updatedData);
  }

  function handleEditFeature(updatedFeature: GeoJSON.Feature) {
    const updatedData = { ...geojsonData };
		updatedData.features = geojsonData.features.map((f) => {
			if (f.properties!.id !== updatedFeature.properties!.id) return f;
			else {
				const updatedFeature = { ...f };
				updatedFeature.properties = { ...updatedFeature.properties };
				return updatedFeature;
			}
    });
    setGeojsonData(updatedData);
  }

  function handleRemoveFeature(uuid: string) {
    if (!window.confirm("Are you sure you want to delete this feature?")) return;
		const updatedData = {
			...geojsonData,
			features: geojsonData.features.filter((f) => f.properties!.id !== uuid),
    };
    setGeojsonData(updatedData);
    map.current.clearAllPopups();
  }
  
  function handleRemoveAll() {
    if (!window.confirm("Are you sure you want to delete all features?")) return;
    // remove data from state
    setGeojsonData(emptyFeatureCollection)
		// clear localStorage
		setLocalStorage(emptyFeatureCollection);
		// clear mapbox source data
		map.current.updateSource(emptyFeatureCollection);
  }

  /* load/save handlers */

  function loadNewData(newGeojsonData: GeoJSON.FeatureCollection) {
		if (!window.confirm("Loading this data will overwrite any existing features. Are you sure you want to continue?")) return;
		// find all popups and remove them!
		setGeojsonData(newGeojsonData);
  }

  // function bundles for props

  const cardFunctions = {
    edit: handleEditFeature,
    goTo: map.current ? map.current.goToWithPopup : null,
    remove: handleRemoveFeature,
  }
  
  return (
		<Grid
			container
			className='App'>
			{/* map Window */}
			<Grid
				component='main'
				item
				xs={12}
				md={8}
				lg={9}
				sx={{ position: 'relative' }}>
				{/* mapbox container */}
				<Box
					className='map-container'
					component='div'
					height='100dvh'
					ref={mapContainer}
				/>
				{/* toolbar */}
        <Toolbar handleAddFeature={handleAddFeature} handleRemoveAll={handleRemoveAll} map={map.current} />
			</Grid>
			{/* sidebar */}
      <Sidebar
        cardFunctions={cardFunctions}
        geojsonData={geojsonData}
        loadNewData={loadNewData}
				map={map.current}
			/>
			{/* dialog(s) */}
		</Grid>
	);
}
