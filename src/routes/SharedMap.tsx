import { useLoaderData } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
// mapboxgl and react hooks
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { bbox } from "@turf/turf";
// import material ui components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
// import styles
import "../App.css";
// import mapHandler from "./mapHandler";
// import components
import MobileSidebar from "../components/MobileSidebar";
import Sidebar from "../components/DesktopSidebar";
// import other local modules
import {
  emptyFeatureCollection,
  firebaseData,
	mapboxSourceId,
	mapboxPointLayerId,
	mapboxPolygonLayerId,
} from "../variables";
// import markerImg from "./assets/icons8-map-pin-48.png"
import { db } from "../firestore";

// add url restrictions before releasing production
// https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

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
	const [geojsonData, setGeojsonData] = useState<GeoJSON.FeatureCollection>(emptyFeatureCollection);

	const { sharingID } = useLoaderData() as { sharingID: string };

	console.log("sharing map at id:", sharingID);

	useEffect(() => {
    mapboxSetup();
		const docRef = doc(db, "maps", sharingID);
		const unsubscribe = onSnapshot(docRef, {
			next: (snapshot) => {
        //  add more error handling here for bad data
        if (snapshot) console.log("snapshot subscribed");
				const data: firebaseData = snapshot.data() as firebaseData;
				// console.log("data retrieved:", data);
				setGeojsonData(JSON.parse(data.geojson));
			},
			error: (e) => console.error("error retrieving snapshot", e),
		});
		return unsubscribe;
	}, [sharingID]);

	function mapboxSetup() {
		// if no map initialise map
		if (!map.current) mapboxInit();
		// if map not loaded, re-run when loaded
		if (!map.current.loaded()) map.current.on("load", mapboxSetup);
		if (!map.current.isStyleLoaded()) return;
		// if source not loaded, load source
		if (!map.current.getSource(mapboxSourceId)) mapboxAddCoreSource();
		// if layer(s) not loaded, load layer(s)
		if (!map.current.getLayer(mapboxPointLayerId)) mapboxAddCoreLayers();
		handlePageLoad();
	}

	// extrapolate map and functions to a separate class module?
	function mapboxInit() {
		if (map.current) return;
		// initialize new map
		map.current = new mapboxgl.Map({
			container: mapContainer.current,
			style: "mapbox://styles/mapbox/dark-v10",
			center: mapCenter,
			zoom: zoom,
		});
		// setup map listeners for user movement
		map.current.on("move", () => {
			setMapCenter(map.current.getCenter());
			setZoom(map.current.getZoom());
		});
	}

	function mapboxAddCoreSource() {
		if (map.current.getSource(mapboxSourceId)) return;
		// add source
		map.current.addSource(mapboxSourceId, {
			type: "geojson",
			data: geojsonData,
		});
	}

	function mapboxAddCoreLayers() {
		if (map.current.getLayer(mapboxPointLayerId)) return;
		map.current.addLayer(
			{
				filter: ["==", ["geometry-type"], "Polygon"],
				id: mapboxPolygonLayerId,
				source: mapboxSourceId,
				type: "fill",
				paint: {
					"fill-color": "red",
					"fill-opacity": 0.5,
				},
			},
			"land-structure-polygon"
		);
		map.current.addLayer(
			{
				filter: ["==", ["geometry-type"], "Polygon"],
				id: "mapboxPolygonLayerId-line",
				source: mapboxSourceId,
				type: "line",
				layout: {
					"line-cap": "round",
					"line-join": "round",
				},
				paint: {
					"line-color": "white",
					"line-opacity": 0.5,
					"line-width": 2.5,
				},
			},
			"land-structure-polygon"
		);
		map.current.addLayer(
			{
				filter: ["==", ["geometry-type"], "Point"],
				id: mapboxPointLayerId,
				source: mapboxSourceId,
				type: "circle",
				paint: {
					"circle-color": "red",
					"circle-opacity": 0.5,
					"circle-radius": 10,
					"circle-stroke-color": "white",
					"circle-stroke-opacity": 0.5,
					"circle-stroke-width": 2.5,
				},
			},
			"road-label"
		);
		// map.current.loadImage(markerImg, (e:mapboxgl.ErrorEvent, img:mapboxgl.ImageSource) => {
		//   if (e) throw e;
		//   map.current.addImage("marker", img, { sdf: true });
		// });
		// map.current.addLayer(
		// 	{
		// 		filter: ["==", ["geometry-type"], "Point"],
		// 		id: mapboxPointLayerId,
		// 		source: mapboxSourceId,
		// 		type: "symbol",
		// 		layout: {
		// 			"icon-allow-overlap": true,
		// 			"icon-anchor": "bottom",
		// 			"icon-image": "marker",
		// 		},
		// 		paint: {
		//       "icon-color": "yellow",
		//     },
		// 	},
		// 	"road-label"
		// );
		map.current.addLayer(
			{
				filter: ["==", ["geometry-type"], "Point"],
				id: `${mapboxPointLayerId}-trigger`,
				source: mapboxSourceId,
				type: "circle",
				paint: {
					"circle-color": "transparent",
					"circle-radius": 20,
				},
			},
			"road-label"
		);
		map.current.on("mouseenter", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], () => (map.current.getCanvas().style.cursor = "pointer"));
		map.current.on("mouseleave", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], () => (map.current.getCanvas().style.cursor = ""));
		map.current.on("click", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], handleFeatureClick);
	}

	function handlePageLoad() {
		// add search for new city feature here
		if (!geojsonData.features.length) return;
		goToBounds(bbox(geojsonData) as mapboxgl.LngLatBoundsLike);
	}

	/* MAPBOX UTILITY FUNCTIONS IN RESPONSE TO USER INTERACTIONS */

	function goToFeature(lngLat: GeoJSON.Position) {
		map.current.easeTo({
			center: lngLat,
			duration: 1000,
		});
	}

	function goToBounds(bounds: mapboxgl.LngLatBoundsLike) {
		map.current.fitBounds(bounds, { padding: 100 });
	}

	function showFeaturePopup(properties: mapboxgl.EventData) {
		if (!properties) return;
		// close other popups? multiple can be opened from sidebar
		const lngLat = typeof properties.center == "string" ? JSON.parse(properties.center) : properties.center;
		const popup = new mapboxgl.Popup({ anchor: "left" });
		popup.setLngLat(lngLat).setHTML(`<h2 style="color:black;">${properties.name}</h2>`).setMaxWidth("300px").addTo(map.current);
	}

	function handleFeatureClick(e: mapboxgl.EventData) {
		// handle click that captures multiple features
		const center = e.features[0].properties.center ? JSON.parse(e.features[0].properties.center) : e.lngLat;
		goToFeature(center);
		showFeaturePopup(e.features[0].properties);
	}

	// update Mapbox when data in state changes from firestore sub
	useEffect(() => {
		// prevents overwriting localStorage with empty collection on load
		if (!geojsonData.features.length && !map.current.getSource(mapboxSourceId)) return;
		// update mapbox data
		mapboxUpdateCoreData();
		map.current.once("load", handlePageLoad);
	}, [geojsonData]);

	function mapboxUpdateCoreData() {
		// mapbox update triggered
		if (map.current.getSource(mapboxSourceId) && map.current.isSourceLoaded(mapboxSourceId)) mapboxSetCoreData();
		// Fired when one of the map's sources loads or changes
		else map.current.on("sourcedata", handleCoreSourceData);
	}

	// listens for our mapbox source to load then updates data
	function handleCoreSourceData(e: mapboxgl.EventData) {
		if (e.sourceId === mapboxSourceId && e.isSourceLoaded) {
			map.current.off("sourcedata", handleCoreSourceData);
			mapboxSetCoreData();
		}
	}

	function mapboxSetCoreData() {
		const s = map.current.getSource(mapboxSourceId);
		s.setData(geojsonData);
	}

	/* prop packages */
	const featureCardFunctions: {
		deleteFeature: (id: string) => void;
		editFeature: (feature: GeoJSON.Feature) => void;
		goToFeature: (e: GeoJSON.Position) => void;
		showFeaturePopup: (e: mapboxgl.EventData) => void;
	} = {
		deleteFeature: () => {
      window.alert("You do not have permission to delete this feature.")
    },
		editFeature: () => {
      window.alert("You do not have permission to edit this feature.")
    },
		goToFeature: goToFeature,
		showFeaturePopup: showFeaturePopup,
	};

	return (
		<Grid container className='App'>
			{/* MapWindow */}
			<Grid component='main' item xs={12} md={8} lg={9} sx={{ position: "relative" }}>
				{/* Mapbox container */}
				<Box className='map-container' component='div' height='100dvh' ref={mapContainer} />
			</Grid>

			{/* Sidebar */}
			{desktop ? ( // should this be in state?
				<Sidebar geojsonData={geojsonData} featureCardFunctions={featureCardFunctions} />
			) : (
				<MobileSidebar geojsonData={geojsonData} featureCardFunctions={featureCardFunctions} />
			)}
		</Grid>
	);
}
