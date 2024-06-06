import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firestore";

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { useEffect, useRef, useState } from 'react';
import { useLoaderData } from "react-router-dom";

import { bbox } from "@turf/turf";

import { mapboxInit, MapController } from '../modules/mapController';
import { emptyFeatureCollection, firebaseData } from '../variables';

export async function shareLoader({ params }:{params: any}) {
  const sharingID = await params.sharingID;
  return { sharingID };
}

export default function SharedMap() {

  // setup map controller,  object and container
	const map: any = useRef(null);
	const mapbox: any = useRef(null);
	const mapContainer: any = useRef(null);
	// setup state for changable map properties
	const [center, setCenter] = useState<mapboxgl.LngLatLike>({ lng: -79.37, lat: 43.65 });
	const [zoom, setZoom] = useState(12);
	// setup geojsonData in state
  const [geojsonData, setGeojsonData] = useState(emptyFeatureCollection);
  // const [shareID, setShareID] = useState("");

  const { sharingID } = useLoaderData() as { sharingID: string };
  // setShareID(sharingID);

	console.debug("shared map with id:", sharingID);

  function onPageLoad() {
    // because there's no data on initial load, it doesn't fire except on page refresh
		if (!geojsonData.features.length) return;
		// add search for new city feature here
		else map.current.goToBounds(bbox(geojsonData) as mapboxgl.LngLatBoundsLike);
	}

  function mapboxSetup() {
    // const localData = getLocalStorage();
    // if (localData) setGeojsonData(localData);
    // if no map, initialise new map
		if (!mapbox.current) mapbox.current = mapboxInit(center, mapContainer.current, setCenter, setZoom, zoom);
		// if map not loaded, re-run when loaded
		if (!mapbox.current.loaded()) mapbox.current.on('load', mapboxSetup);
		if (!mapbox.current.isStyleLoaded()) return;
		// if no controller, initialise new controller
		if (!map.current) map.current = new MapController(mapbox.current);
		// load initial source and layers
    map.current.setupSource(geojsonData);
    map.current.setupNewPolygonSource([]);
		// why does this keep firing?
		// re-renders from setup useEffect when all dependencies are added
		// also seems to break featureCard easeTo ??
		// mapbox.current.once("idle", onPageLoad);
	}
    // setup mapbox on initial render
	useEffect(mapboxSetup, []);

  useEffect(() => {
    const docRef = doc(db, "maps", sharingID);
		const unsubscribe = onSnapshot(docRef, {
			next: (snapshot) => {
        //  add more error handling here for bad data
        if (snapshot) console.debug("snapshot subscribed");
				const data: firebaseData = snapshot.data() as firebaseData;
				// console.log("data retrieved:", data);
				setGeojsonData(JSON.parse(data.geojson));
			},
			error: (e) => console.error("error retrieving snapshot", e),
		});
		return unsubscribe;
  }, [sharingID])

  useEffect(() => {
    // prevents overwriting localStorage with empty collection on page load
		if (!geojsonData.features.length && !map.current?.isSourceLoaded()) return;
    // update mapbox source data
		if (map.current) map.current.updateSource(geojsonData);
		console.debug("geojsonData updated:", geojsonData);
  }, [geojsonData])

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
			</Grid>
			{/* sidebar */}
      {/* <Sidebar
        cardFunctions={cardFunctions}
        geojsonData={geojsonData}
        loadNewData={loadNewData}
        removeAll={handleRemoveAll}
				map={map.current}
			/> */}
			{/* dialog(s) */}
		</Grid>
  );
}