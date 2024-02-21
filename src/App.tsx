// mapboxgl and react hooks
import mapboxgl from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
// import material ui components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
// import material ui icons
import ExploreIcon from "@mui/icons-material/Explore";
import PlaceIcon from "@mui/icons-material/Place";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PolylineIcon from "@mui/icons-material/Polyline";
import RouteIcon from "@mui/icons-material/Route";
// import styles
import "./App.css";
// import components
import AddFeatureDialog from "./components/AddFeatureDialog";
import MobileSidebar from "./components/MobileSidebar";
import Sidebar from "./components/Sidebar";
// import other local modules
import {
	localStorageId,
	mapboxDraftSourceId,
	mapboxLayerId,
	mapboxPolygonLayerId,
	mapboxSourceId,
	emptyFeatureCollection,
	mapboxDraftMultiPointLayerId,
	mapboxDraftLineLayerId,
	mapboxDraftFillLayerId,
} from "./variables";

// add url restrictions before releasing production
// https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

export default function App() {
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

	// possible alternative to useEffect with geojsonData dependency (i.e. call instead of setGeojsonData)
	// function updateGeojsonData(newData: GeoJSON.FeatureCollection) {
	//   if (!geojsonData.features.length) {
	//     if (window.confirm("You're about to overwrite any save features with an empty geojson object. Do you want to Continue?")) return;
	//   }
	//   // convert current data to a string and update localStorage
	//   try {
	//     const s = JSON.stringify(newData);
	//     if (s) localStorage.setItem(localStorageId, s);
	//     // catch and report any errors
	//   } catch (error: any) {
	//     console.error("Error updating localStorage:", error.message);
	//   }
	// 	setGeojsonData(newData);
	// 	// update mapbox data
	// 	mapboxUpdateData();
	// }

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
			const c = map.current.getCenter();
			setMapCenter({ lng: c.lng, lat: c.lat });
			setZoom(map.current.getZoom());
		});
	}

	function mapboxAddSource() {
		if (map.current.getSource(mapboxSourceId)) return;
		// add source
		map.current.addSource(mapboxSourceId, {
			type: "geojson",
			data: geojsonData,
		});
		// add draft source
		// map.current.addSource(mapboxDraftSourceId, {
		// 	type: "geojson",
		// 	data: {
		// 		type: "Feature",
		// 		geometry: {
		// 			type: "Polygon",
		// 			coordinates: [newPolygonCoordinates],
		// 		},
		// 	},
		// });
	}

	function mapboxAddLayer() {
		if (map.current.getLayer(mapboxLayerId)) return;
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
      "land-structure-polygon",

		);
		// add layer
		map.current.addLayer(
			{
				filter: ["==", ["geometry-type"], "Point"],
				id: mapboxLayerId,
				source: mapboxSourceId,
				type: "circle",
				paint: {
					"circle-color": "red",
					"circle-opacity": 0.75,
					"circle-radius": 10,
				},
			},
			"road-label"
		);
		map.current.addLayer(
			{
				filter: ["==", ["geometry-type"], "Point"],
				id: `${mapboxLayerId}-trigger`,
				source: mapboxSourceId,
				type: "circle",
				paint: {
					"circle-color": "transparent",
					// "circle-opacity": 0,
					"circle-radius": 20,
				},
			},
			"road-label"
		);
		map.current.on(
			"mouseenter",
			`${mapboxLayerId}-trigger`,
			() => (map.current.getCanvas().style.cursor = "pointer")
		);
		map.current.on(
			"mouseleave",
			`${mapboxLayerId}-trigger`,
			() => (map.current.getCanvas().style.cursor = "")
		);
		map.current.on("click", `${mapboxLayerId}-trigger`, showLayerPopup);
		// map.current.addLayer({
		// 	id: mapboxDraftFillLayerId,
		// 	source: mapboxDraftSourceId,
		// 	type: "fill",
		// 	paint: {
		// 		"fill-color": "yellow",
		// 		"fill-opacity": 0.5,
		// 		"fill-outline-color": "blue",
		// 	},
		// });
	}

	function showLayerPopup(e: mapboxgl.EventData) {
		// console.log(e.features, e.target);
		map.current.easeTo({
			// consider adding coords to properties, so popups are always centered on the feature
			// (use turf tools to get polygon centres)
			center: e.lngLat,
			duration: 1000,
		});
		const popup = new mapboxgl.Popup({ anchor: "left" });
		popup
			.setLngLat(e.lngLat)
			.setHTML(`<h2 style="color:black;">${e.features[0].properties.name}</h2>`)
			.setMaxWidth("300px")
			.addTo(map.current);
	}

	function mapboxSetData() {
		const s = map.current.getSource(mapboxSourceId);
		s.setData(geojsonData);
	}

	function handleSourcedata(e: mapboxgl.EventData) {
		if (e.sourceId === mapboxSourceId && e.isSourceLoaded) {
			map.current.off("sourcedata", handleSourcedata);
			mapboxSetData();
		}
	}

	function mapboxUpdateData() {
		// mapbox update triggered
		if (
			map.current.getSource(mapboxSourceId) &&
			map.current.isSourceLoaded(mapboxSourceId)
		)
			mapboxSetData();
		// Fired when one of the map's sources loads or changes
		else map.current.on("sourcedata", handleSourcedata);
	}

	function mapboxSetup() {
		// if no map initialise map
		if (!map.current) mapboxInit();
		// if map not loaded, re-run when loaded
		if (!map.current.loaded()) map.current.on("load", mapboxSetup);
		if (!map.current.isStyleLoaded()) return;
		// if source not loaded, load source
		if (!map.current.getSource(mapboxSourceId)) mapboxAddSource();
		// if layer(s) not loaded, load layer(s)
		if (!map.current.getLayer(mapboxLayerId)) mapboxAddLayer();
	}

	// store geojson data in state on page load
	function initializeLocalStorage() {
		// get item from localStorage,
		const item = localStorage.getItem(localStorageId);
		// it no item, reset storage to create empty feature collection item
		// if (!item) clearAllData();
		// what if localStorage is lost (cache cleared) but data is still present in state? Worth preserving state?
		try {
			if (!item) return;
			const data: GeoJSON.FeatureCollection = JSON.parse(item);
			if (data) setGeojsonData(data);
		} catch (error: any) {
			// Handle the error here
			console.error("Error loading data from localStorage:", error.message);
			clearAllData();
		}
	}

	// get local storage and initialize map once on page load
	useEffect(() => {
		initializeLocalStorage();
		mapboxSetup();
	}, []);

	// update localStorage and Mapbox when data in state changes
	useEffect(() => {
		// prevents overwriting localStorage with empty collection on load
		if (!geojsonData.features.length) return;
		// convert current data to a string and update localStorage
		try {
			const s = JSON.stringify(geojsonData);
			if (s) localStorage.setItem(localStorageId, s);
			// catch and report any errors
		} catch (error: any) {
			console.error("Error updating localStorage:", error.message);
		}
		// update mapbox data
		mapboxUpdateData();
	}, [geojsonData]);

	/* USER FUNCTIONS */

	function resetNewFeatureProps() {
		setNewPointCoordinates([0, 0]);
		setNewPolygonCoordinates([]);
		setNewFeatureName("");
		setNewFeatureTags("");
		setNewFeatureNotes("");
	}
	// setup dialog handlers
	const [addPointDialogOpen, setAddPointDialogOpen] = useState(false);
	const openAddPointDialog = () => setAddPointDialogOpen(true);
	function closeAddPointDialog() {
		setAddPointDialogOpen(false);
		resetNewFeatureProps();
	}
	const [addPolygonDialogOpen, setAddPolygonDialogOpen] = useState(false);
	const openAddPolygonDialog = () => setAddPolygonDialogOpen(true);
	function closeAddPolygonDialog() {
		setAddPolygonDialogOpen(false);
		resetNewFeatureProps();
	}

	// setup state for new feature properties in progress
	const [newFeatureName, setNewFeatureName] = useState<string>("");
	const [newFeatureTags, setNewFeatureTags] = useState<string>("");
	const [newFeatureNotes, setNewFeatureNotes] = useState<string>("");
	const [newPointCoordinates, setNewPointCoordinates] = useState([0, 0]);

	// add a point feature to the map (and data)
	function addPointFeature() {
		// build new feature object
		const newPointFeature: GeoJSON.Feature = {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: newPointCoordinates,
			},
			properties: {
				address: "",
				color: "",
				created: Date.now(),
				id: uuid(),
				name: newFeatureName,
				notes: newFeatureNotes,
				tags: newFeatureTags,
			},
		};
		// rebuild data with new feature
		const newData = { ...geojsonData };
		newData.features.push(newPointFeature);
		// update data in state
		setGeojsonData(newData);
		// close the dialog modal
		closeAddPointDialog();
	}

	function addPointListener() {
		// set cursor to a pointer
		map.current.getCanvas().style.cursor = "pointer";
		// listen for the users click, then:
		map.current.once("click", (e: mapboxgl.EventData) => {
			const f = map.current.queryRenderedFeatures(
				[e.lngLat.lng, e.lngLat.lat], // probably need a borBox for wider capture
				{ layers: ["poi-label"] } // expand to all label layers?
			);
			// console.log("poi-label features", f);
			// center map on click
			map.current.easeTo({
				center: e.lngLat,
				duration: 1000,
			});
			// set coordinates in state
			setNewPointCoordinates([e.lngLat.lng, e.lngLat.lat]);
			// return cursor to default
			map.current.getCanvas().style.cursor = "";
			// open properties dialog to get properties
			openAddPointDialog();
		});
	}

	const [newPolygonCoordinates, setNewPolygonCoordinates] = useState<
		number[][]
	>([]);

	// add a polygon feature to the map (and data)
	function addPolygonFeature() {
		const newPolygon: GeoJSON.Polygon = {
			type: "Polygon",
			coordinates: [newPolygonCoordinates],
		};
    // add initial point to array to complete the polygon
		newPolygon.coordinates[0].push(newPolygon.coordinates[0][0]);
		const newPolygonFeature: GeoJSON.Feature = {
			type: "Feature",
			geometry: newPolygon,
			properties: {
				address: "",
				color: "",
				created: Date.now(),
				id: uuid(),
				name: newFeatureName,
				notes: newFeatureNotes,
				tags: newFeatureTags,
			},
		};
		// rebuild data with new feature
		const newData = { ...geojsonData };
		newData.features.push(newPolygonFeature);
		// update data in state
		setGeojsonData(newData);
		// close the dialog modal
		closeAddPolygonDialog();
	}

	useEffect(() => {
		console.debug("newPolygonCoordinates trigger useEffect", newPolygonCoordinates);
    // trigger conditional draft rendering from here
	}, [newPolygonCoordinates]);

	function addPolygonPointsToState(e: mapboxgl.EventData) {
    setNewPolygonCoordinates(currentState =>  [...currentState, [e.lngLat.lng, e.lngLat.lat]]);
	}

	function addPolygonListener() {
		// set cursor to a pointer
		map.current.getCanvas().style.cursor = "pointer";
		// start listening for the users clicks to add points
		map.current.on("click", addPolygonPointsToState);
		// start listening for a user double click to add feature
		map.current.once("dblclick", () => {
			map.current.off("click", addPolygonPointsToState);
			map.current.getCanvas().style.cursor = "";
			openAddPolygonDialog();
		});
	}

	// erase all data
	function clearAllData() {
		if (!window.confirm("Erase all data?")) return;
		// update mapbox data with an empty feature collection
		const s = map.current.getSource(mapboxSourceId);
		if (!s) return;
		s.setData(emptyFeatureCollection);
		// replace localStorage item with an empty feature collection
		localStorage.setItem(
			localStorageId,
			JSON.stringify(emptyFeatureCollection)
		);
		// reset data in state with an empty feature collection
		setGeojsonData(emptyFeatureCollection);
	}

	return (
		<Grid container className="App">
			{/* MapWindow */}
			<Grid
				component="main"
				item
				xs={12}
				md={8}
				lg={9}
				sx={{ position: "relative" }}
			>
				{/* Mapbox container */}
				<Box
					className="map-container"
					component="div"
					height="100dvh"
					ref={mapContainer}
				/>

				{/* lngLatZoom readout for dev only */}
				<Box
					className="floatingElement"
					sx={{
						display: {
							xs: "none",
							md: "block",
						},
						position: "absolute",
						top: 0,
						left: 0,
					}}
				>
					Center: Lng: {mapCenter.lng.toFixed(4)} | Lat:{" "}
					{mapCenter.lat.toFixed(4)} | Zoom: {zoom.toFixed(2)}
				</Box>

				{/* Toolbar */}
				<Stack
					alignItems="center"
					justifyContent="center"
					direction="row"
					marginY="20px"
					spacing={{ xs: 1, md: 2 }}
					// minWidth="250px"
					sx={{
						bottom: {
							xs: "auto",
							md: 0,
						},
						left: "50%",
						top: {
							xs: 0,
							md: "auto",
						},
						position: "absolute",
						translate: "-50%",
					}}
				>
					{/* <Tooltip title="Select a feature"> */}
					<Button
						disabled
						variant="contained"
						sx={{
							minWidth: "auto",
							p: 1,
						}}
					>
						<ExploreIcon />
					</Button>
					{/* </Tooltip> */}
					<Tooltip title="Add a point feature">
						<Button
							onClick={addPointListener}
							variant="contained"
							sx={{
								minWidth: "auto",
								p: 1,
							}}
						>
							<PlaceIcon />
						</Button>
					</Tooltip>
					<Tooltip title="Add a polygon feature">
						<Button
							onClick={addPolygonListener}
							variant="contained"
							sx={{
								minWidth: "auto",
								p: 1,
							}}
						>
							<PolylineIcon />
						</Button>
					</Tooltip>
					{/* <Tooltip title="Calculate a route"> */}
					<Button
						disabled
						variant="contained"
						sx={{
							minWidth: "auto",
							p: 1,
						}}
					>
						<RouteIcon />
					</Button>
					{/* </Tooltip> */}
					<Tooltip title="Delete all features">
						<Button
							onClick={clearAllData}
							variant="contained"
							sx={{
								minWidth: "auto",
								p: 1,
							}}
						>
							<DeleteForeverIcon />
						</Button>
					</Tooltip>
				</Stack>

				<AddFeatureDialog
					isOpen={addPointDialogOpen}
					nameValue={newFeatureName}
					tagsValue={newFeatureTags}
					notesValue={newFeatureNotes}
					nameSetter={setNewFeatureName}
					tagsSetter={setNewFeatureTags}
					notesSetter={setNewFeatureNotes}
					handleAddFeature={addPointFeature}
					handleClose={closeAddPointDialog}
				/>

				<AddFeatureDialog
					isOpen={addPolygonDialogOpen}
					nameValue={newFeatureName}
					tagsValue={newFeatureTags}
					notesValue={newFeatureNotes}
					nameSetter={setNewFeatureName}
					tagsSetter={setNewFeatureTags}
					notesSetter={setNewFeatureNotes}
					handleAddFeature={addPolygonFeature}
					handleClose={closeAddPolygonDialog}
				/>
			</Grid>

			{/* Sidebar */}
			{desktop ? ( // should this be in state?
				<Sidebar geojsonData={geojsonData} />
			) : (
				<MobileSidebar geojsonData={geojsonData} />
			)}
		</Grid>
	);
}
