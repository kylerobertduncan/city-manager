// mapboxgl and react hooks
import mapboxgl from "mapbox-gl";
import { FormEvent, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";
// import material ui components
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
// import material ui icons
import ExploreIcon from "@mui/icons-material/Explore";
import PlaceIcon from "@mui/icons-material/Place";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PolylineIcon from "@mui/icons-material/Polyline";
import RouteIcon from "@mui/icons-material/Route";
// import styles
import "./App.css";
// import components
import Sidebar from "./components/Sidebar";
import MobileSidebar from "./components/MobileSidebar";
// import other local modules
import {
	localStorageId,
	mapboxLayerId,
	mapboxSourceId,
	emptyFeatureCollection,
} from "./variables";

// add url restrictions before releasing production
// https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

export default function App() {
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
	function updateGeojsonData(newData: GeoJSON.FeatureCollection) {
		// convert current data to a string and update localStorage
		try {
			const s = JSON.stringify(newData);
			if (s) localStorage.setItem(localStorageId, s);
			// catch and report any errors
		} catch (error: any) {
			console.error("Error updating localStorage:", error.message);
		}
		setGeojsonData(newData);
		// update mapbox data
		mapboxUpdateData();
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
	}

	function mapboxAddLayer() {
		if (map.current.getLayer(mapboxLayerId)) return;
		// add layer
		map.current.addLayer(
			{
				id: mapboxLayerId,
				source: mapboxSourceId,
				type: "circle",
				paint: {
					"circle-color": "red",
          "circle-opacity": 0.75,
				},
			},
			"road-label"
		);
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
		// console.log(map.current.getStyle().layers);
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

	// setup dialog handlers
	const [dialogOpen, setDialogOpen] = useState(false);
	const openDialog = () => setDialogOpen(true);
	function closeDialog() {
		setDialogOpen(false);
		setNewCoordinates([0, 0]);
		setNewFeatureName("");
		setNewFeatureTags("");
		setNewFeatureNotes("");
	}

	const [newCoordinates, setNewCoordinates] = useState([0, 0]);
	const [newFeatureName, setNewFeatureName] = useState("");
	const [newFeatureTags, setNewFeatureTags] = useState("");
	const [newFeatureNotes, setNewFeatureNotes] = useState("");

	// add a point feature to the map (and data)
	function addPointFeature(e: FormEvent<HTMLFormElement>) {
		// prevent defaul form submit actions
		e.preventDefault();
		// build new feature object
		const newPointFeature: GeoJSON.Feature = {
			type: "Feature",
			geometry: {
				type: "Point",
				coordinates: newCoordinates,
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
		closeDialog();
	}

	function addPointListener() {
		// set cursor to a pointer
		map.current.getCanvas().style.cursor = "pointer";
		// listen for the users click, then:
		map.current.once("click", (e: mapboxgl.EventData) => {
			// console.log(e.lngLat);
			const f = map.current.queryRenderedFeatures(
				[e.lngLat.lng, e.lngLat.lat], // probably need a borBox for wider capture
				{ layers: ["poi-label"] } // expand to all label layers?
			);
			console.log(f);
			// set coordinates in state
			setNewCoordinates([e.lngLat.lng, e.lngLat.lat]);
			// return cursor to default
			map.current.getCanvas().style.cursor = "";
			// open properties dialog to get properties
			openDialog();
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
					<Tooltip title="Select a feature">
						<Button
							variant="contained"
							sx={{
								minWidth: "auto",
								p: 1,
							}}
						>
							<ExploreIcon />
						</Button>
					</Tooltip>
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
							variant="contained"
							sx={{
								minWidth: "auto",
								p: 1,
							}}
						>
							<PolylineIcon />
						</Button>
					</Tooltip>
					<Tooltip title="Calculate a route">
						<Button
							variant="contained"
							sx={{
								minWidth: "auto",
								p: 1,
							}}
						>
							<RouteIcon />
						</Button>
					</Tooltip>
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

				{/* modal form for feature properties */}
				<Dialog
					onClose={closeDialog}
					open={dialogOpen}
					PaperProps={{
						component: "form",
						onSubmit: addPointFeature,
					}}
				>
					<DialogTitle>New Feature Properties</DialogTitle>

					<DialogContent>
						<DialogContentText>
							Enter the details of your new feature:
						</DialogContentText>

						<TextField
							autoFocus
							required
							margin="dense"
							id="name"
							name="name"
							label="Name"
							fullWidth
							value={newFeatureName}
							onChange={(e) => setNewFeatureName(e.target.value)}
						/>
						<TextField
							margin="dense"
							id="tags"
							name="tags"
							label="Tags"
							fullWidth
							value={newFeatureTags}
							onChange={(e) => setNewFeatureTags(e.target.value)}
						/>
						<TextField
							multiline
							margin="dense"
							id="notes"
							name="notes"
							label="Notes"
							fullWidth
							minRows={3}
							value={newFeatureNotes}
							onChange={(e) => setNewFeatureNotes(e.target.value)}
						/>
					</DialogContent>

					<DialogActions>
						<Button type="submit" variant="outlined">
							Add Feature
						</Button>
						<Button onClick={closeDialog} variant="outlined">
							Cancel
						</Button>
					</DialogActions>
				</Dialog>
			</Grid>

			{/* Sidebar */}
			{/* add conditional load based on useMediaQuery */}
			<Sidebar geojsonData={geojsonData} />
			<MobileSidebar geojsonData={geojsonData} />
		</Grid>
	);
}
