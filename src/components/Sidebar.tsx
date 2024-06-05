import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Tooltip from "@mui/material/Tooltip";
// import MapIcon from "@mui/icons-material/Map";
import ViewListIcon from "@mui/icons-material/ViewList";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
// local components
import FeatureCard from "./NewFeatureCard";
import SidebarHeader from "./SidebarHeader";
import SidebarFooter from "./SidebarFooter";
// local modules
import { MapController } from "../modules/mapController";
import { saveCurrentData } from "../fileManager";

export default function Sidebar({
	cardFunctions,
	geojsonData,
  loadNewData,
  removeAll,
	map,
}: {
	cardFunctions: {
		goTo: (properties: mapboxgl.EventData) => void;
		handleEdit: (feature: GeoJSON.Feature) => void;
		handleRemove: (uuid: string) => void;
	};
	geojsonData: GeoJSON.FeatureCollection;
  loadNewData: (newGeojsonData: GeoJSON.FeatureCollection) => void;
  removeAll: () => void;
	map: MapController;
}) {
	// establish screen size
	const theme = useTheme();
	// should this be in state?
	const desktop = useMediaQuery(theme.breakpoints.up("md"));
	// set state and functions for mobile drawer
	const [drawerOpen, setDrawerOpen] = useState(false);

	function save() {
		saveCurrentData(geojsonData);
	}

	function SidebarContent() {
		return (
			<>
				{/* sidebar header (and menu) */}
				<SidebarHeader
					desktop={desktop}
					setDrawerOpen={setDrawerOpen}
				/>
				{/* feature cards */}
				<Container sx={{ marginTop: "24px" }}>
					<Grid
						component="ul"
						container
						spacing={3}
						paddingLeft="0"
						sx={{}}>
						{geojsonData.features.map((f: GeoJSON.Feature) => {
							if (!f.properties) return null;
							return (
								<Grid
									component="li"
									item
									key={f.properties.id}
									xs={12}>
									<FeatureCard
										feature={f}
										goTo={cardFunctions.goTo}
										handleEdit={cardFunctions.handleEdit}
										handleRemove={cardFunctions.handleRemove}
									/>
								</Grid>
							);
						})}
					</Grid>
				</Container>
        <SidebarFooter
          load={loadNewData}
          save={save}
          removeAll={removeAll}
        />
			</>
		);
	}

	if (desktop) {
		return (
			// desktop sidebar
			<Grid
				component="aside"
				item
				maxHeight="100vh"
				position="relative"
				xs={12}
				md={4}
				lg={3}
				sx={{
					display: {
						xs: "none",
						md: "block",
          },
          overflowY: "scroll",
				}}>
				<SidebarContent />
			</Grid>
		);
	} else {
		return (
			// mobile sidebar
			<>
				{/* Open Sidebar */}
				<Tooltip title="Open feature list">
					<Button
						onClick={() => setDrawerOpen(true)}
						variant="contained"
						sx={{
							opacity: 0.9,
							display: {
								xs: "inline-flex",
								md: "none",
							},
							minWidth: "auto",
							p: 1,
							position: "absolute",
							right: 0,
							top: "50%",
							translate: "-50%",
						}}>
						<ViewListIcon />
					</Button>
				</Tooltip>
				<SwipeableDrawer
					anchor="right"
					onClose={() => setDrawerOpen(false)}
					onOpen={() => setDrawerOpen(true)}
					open={drawerOpen}
					transitionDuration={350}>
					<Box position="relative" width="350px">
						<SidebarContent />
					</Box>
				</SwipeableDrawer>
			</>
		);
	}
}
