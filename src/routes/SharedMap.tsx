import { useLoaderData } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
// mapboxgl and react hooks
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { bbox, centerOfMass } from "@turf/turf";
// import material ui components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
// import styles
import "./App.css";
// import mapHandler from "./mapHandler";
// import components
import MobileSidebar from "../components/MobileSidebar";
import Sidebar from "../components/Sidebar";
// import other local modules
import {
	localStorageId,
  featureProperties,
  emptyFeatureProperties,
	emptyFeatureCollection,
	mapboxSourceId,
	mapboxPointLayerId,
	mapboxPolygonLayerId,
	newPolygonSource,
	newPolygonPointLayer,
	newPolygonLineLayer,
	liveLineSource,
	liveLineLayer,
} from "../variables";
// import markerImg from "./assets/icons8-map-pin-48.png"
import { db } from "../firestore";

export async function shareLoader({ params }:{params: any}) {
  const sharingID = await params.sharingID;
  return { sharingID };
}

export default function SharedMap() {

  // establish screen size
	const theme = useTheme();
	// should this be in state?
	const desktop = useMediaQuery(theme.breakpoints.up("md"));
	// setup map object and container
	const map: any = useRef(null);
	const mapContainer: any = useRef(null);
	// setup state for changable map properties
	const [mapCenter, setMapCenter] = useState({ lng: -79.37, lat: 43.65 });
	const [zoom, setZoom] = useState(12);
	// setup state for local storage geojson object
	const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection>(
		emptyFeatureCollection
  );

  const { sharingID } = useLoaderData() as { sharingID: string };
  
  console.log("sharing map at id:", sharingID);
  
  // wrap in a useEffect that runs the unsubscribe when the component is closed
  const unsubscribe = onSnapshot(doc(db, "maps", sharingID), (doc) => {
    // console.log("Current data: ", doc.data());
    const data = doc.data();
    console.log("geojson data:", JSON.parse(data?.geojson))
    setGeojsonData(JSON.parse(data?.geojson));
  });
  
  
  return (
		<Grid container className='App'>
			{/* MapWindow */}
			<Grid component='main' item xs={12} md={8} lg={9} sx={{ position: "relative" }}>
				{/* Mapbox container */}
				<Box className='map-container' component='div' height='100dvh' ref={mapContainer} />

			</Grid>

			{/* Sidebar */}
			{/* {desktop ? ( // should this be in state?
				<Sidebar geojsonData={geojsonData} featureCardFunctions={featureCardFunctions} />
			) : (
				<MobileSidebar geojsonData={geojsonData} featureCardFunctions={featureCardFunctions} />
			)} */}
		</Grid>
	);
}
