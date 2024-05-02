import mapboxgl from "mapbox-gl";
// import material ui icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExploreIcon from "@mui/icons-material/Explore";
// better icon for selecting?
import PlaceIcon from "@mui/icons-material/Place";
import PolylineIcon from "@mui/icons-material/Polyline";
import RouteIcon from "@mui/icons-material/Route";
// material UI components
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
// react components
import { useCallback, useEffect, useState } from "react";
import { MapController } from "../modules/mapController";
import FeatureDialog from "./NewFeatureDialog";

export default function Toolbar({ handleAddFeature, handleRemoveAll, map }: {
  handleAddFeature: (newFeature: GeoJSON.Feature) => void,
  handleRemoveAll: () => void,
  map: MapController
}) {
  
	const [activeTool, setActiveTool] = useState("select");
	const [newFeatureDialogOpen, setNewFeatureDialogOpen] = useState(false);
  const [newFeatureGeometry, setNewFeatureGeometry] = useState<GeoJSON.Point | GeoJSON.Polygon>({ type: "Point", coordinates: [] });
  
	function handleCloseDialog() {
		setNewFeatureDialogOpen(false);
    setNewFeatureGeometry({ type: "Point", coordinates: [] });
    map.updateNewPolygonSource([]);
    map.clearLiveLine();
    setActiveTool("select");
	}

	const handleAddPoint = useCallback(
		(e: mapboxgl.EventData) => {
			// flyTo lngLat
			map.goToFeature(e.lngLat);
			// set lngLat as newGeometry
			setNewFeatureGeometry({
				type: "Point",
				coordinates: [e.lngLat.lng, e.lngLat.lat],
			});
			// open new feature dialog
			setNewFeatureDialogOpen(true);
			// reset cursor
			map.defaultCursor();
		},
		[map]
	);

	const handleAddPolygon = useCallback(
		(e: mapboxgl.EventData) => {
			e.preventDefault();
      map.mapbox.off("click", savePoints);
      map.mapbox.off("mousemove", handleLiveLine);
			setNewFeatureGeometry((currentGeometry) => {
				const coordinates = currentGeometry.coordinates[0] as GeoJSON.Position[];
				return {
					type: "Polygon",
					coordinates: [[...coordinates, coordinates[0]]],
				};
			});
			// open new feature dialog
			setNewFeatureDialogOpen(true);
			// reset cursor
			map.defaultCursor();
		},
		[map]
  );
  
  const handleLiveLine = useCallback(
    (e: mapboxgl.EventData) => {
      map.updateLivelineSource(e);
		},
		[map]
  );
  
  // trigger conditional draft rendering from here
  useEffect(() => {
		const polygonCoordinates = newFeatureGeometry.coordinates[0] as GeoJSON.Position[];
		// avert any action on page mount/before first point added
		if (!polygonCoordinates) return;
		// update static draft polygon
    map.updateNewPolygonSource(polygonCoordinates);
    // update liveLine static point(s);
		map.updateLiveLineFixedPoints(polygonCoordinates);
	}, [newFeatureGeometry]);

  const savePoints = useCallback((e: mapboxgl.EventData) => {
		setNewFeatureGeometry((currentGeometry) => {
      const coordinates = currentGeometry.coordinates[0] as GeoJSON.Position[];
			return {
				type: "Polygon",
				coordinates: [[...coordinates, [e.lngLat.lng, e.lngLat.lat]]],
			};
    });
	}, []);

  function addPolygonListener() {
		// update geometry template
		setNewFeatureGeometry({
      type: "Polygon",
			coordinates: [[]],
		});
		// start listening for the users clicks to add points
		map.mapbox.on("click", savePoints);
		// start listening for a user double click to add feature
		map.mapbox.once("dblclick", handleAddPolygon);
    console.log("Before error");
    // start listening for mouse movement to show polyLines
    map.setupLivelineSource([]);
		console.log("After error");
    map.mapbox.on("mousemove", handleLiveLine);
	}

	function handleActiveTool(_: React.MouseEvent, tool: string) {
		// handle click of current tool
		if (!tool) return;
		// remove listener for previous tool
		if (activeTool === "polygon") {
      map.updateNewPolygonSource([]);
      map.mapbox.off("click", savePoints);
      map.mapbox.off("dblclick", handleAddPolygon);
      map.mapbox.off("mousemove", handleLiveLine);
		}
		if (activeTool === "point") map.mapbox.off("click", handleAddPoint);
		// change tool in state
		setActiveTool(tool);
		// handle different tools
		if (tool === "point") {
			map.pointerCursor();
			map.mapbox.once("click", handleAddPoint);
		}
    if (tool === "polygon") {
      map.pointerCursor();
      addPolygonListener();
		}
		if (tool === "removeAll") {
			handleRemoveAll();
			setActiveTool("select");
		}
		if (tool === "select") map.defaultCursor();
	}

	return (
		<>
			<ToggleButtonGroup
				aria-label="Select active tool"
				exclusive
				// onChange={(_, v) => setActiveTool(v)}
				onChange={handleActiveTool}
				// size={xs:"small"; md: "medium"}
				value={activeTool}
				sx={{
					// add a bgcolor/fill?
					bottom: {
						xs: "auto",
						md: 20,
					},
					left: "50%",
					top: {
						xs: 10,
						md: "auto",
					},
					position: "absolute",
					translate: "-50%",
				}}>
				<Tooltip title="Select a Feature">
					<ToggleButton
						aria-label=""
						value={"select"}>
						<ExploreIcon />
					</ToggleButton>
				</Tooltip>
				<Tooltip title="Add a Point Feature">
					<ToggleButton
						aria-label=""
						value={"point"}>
						<PlaceIcon />
					</ToggleButton>
				</Tooltip>
				<Tooltip title="Add a Polygon Feature">
					<ToggleButton
						aria-label=""
						value={"polygon"}>
						<PolylineIcon />
					</ToggleButton>
				</Tooltip>
				<Tooltip title="Caclulate Route">
					<ToggleButton
						aria-label=""
						value={"route"}>
						<RouteIcon />
					</ToggleButton>
				</Tooltip>
				<Tooltip title="Delete All Features">
					<ToggleButton
						aria-label=""
						value={"removeAll"}>
						<DeleteForeverIcon />
					</ToggleButton>
				</Tooltip>
			</ToggleButtonGroup>
			{/* feature dialog to collect properties */}
			<FeatureDialog
				geometry={newFeatureGeometry}
				handleAddFeature={handleAddFeature}
				handleCloseDialog={handleCloseDialog}
				isOpen={newFeatureDialogOpen}
			/>
		</>
	);
}
