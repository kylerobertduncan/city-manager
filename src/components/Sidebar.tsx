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
// import SidebarHeader from "./SidebarHeader";
// local modules
import { MapController } from "../modules/mapController";

export default function Sidebar({
	cardFunctions,
	geojsonData,
	map,
}: {
	cardFunctions: {
		edit: (feature: GeoJSON.Feature) => void;
		goTo: (properties: mapboxgl.EventData) => void;
		remove: (uuid: string) => void;
	};
	geojsonData: GeoJSON.FeatureCollection;
	map: MapController;
}) {
	// establish screen size
	const theme = useTheme();
	// should this be in state?
	const desktop = useMediaQuery(theme.breakpoints.up("md"));
	// set state and functions for mobile drawer
	const [drawerOpen, setDrawerOpen] = useState(false);

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
                    // edit={cardFunctions.edit}
                    goTo={cardFunctions.goTo}
                    remove={cardFunctions.remove}
									/>
								</Grid>
							);
						})}
					</Grid>
				</Container>
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
					overflowY: "scroll",
					display: {
						xs: "none",
						md: "block",
					},
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
					<Box width="350px">
						<SidebarContent />
					</Box>
				</SwipeableDrawer>
				{/* <Tooltip title='Back to map'>
					<Button
						onClick={() => setDrawerOpen(false)}
						variant='contained'
						sx={{
							// px: 1,
							opacity: 0.9,
							display: {
								xs: drawerOpen ? "inline-flex" : "none",
								md: "none",
							},
							minWidth: "auto",
							p: 1,
							position: "absolute",
							left: 0,
							top: "50%",
							translate: "-50%",
						}}
					>
						<MapIcon />
					</Button>
				</Tooltip> */}
			</>
		);
	}
}
