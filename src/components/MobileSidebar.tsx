import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MapIcon from "@mui/icons-material/Map";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import ViewListIcon from "@mui/icons-material/ViewList";

import FeatureCard from "./FeatureCard";

export default function MobileSidebar({
	geojsonData,
	featureCardFunctions,
}: {
	geojsonData: GeoJSON.FeatureCollection;
	featureCardFunctions: {
		deleteFeature: (id: string) => void;
		editFeature: (feature: GeoJSON.Feature) => void;
		goToFeature: (e: GeoJSON.Position) => void;
		showFeaturePopup: (e: mapboxgl.EventData) => void;
	};
}) {
	const [drawerOpen, setDrawerOpen] = useState(false);
	const openDrawer = () => setDrawerOpen(true);
	const closeDrawer = () => setDrawerOpen(false);

	return (
		<div>
			<>
				{/* Open Sidebar */}
				<Tooltip title="Open feature list">
					<Button
						onClick={openDrawer}
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
						}}
					>
						<ViewListIcon />
					</Button>
				</Tooltip>
				<SwipeableDrawer
					anchor="right"
					onClose={closeDrawer}
					onOpen={openDrawer}
					open={drawerOpen}
					transitionDuration={350}
				>
					<Box width="350px">
						<Toolbar
							sx={{
								bgcolor: "grey.900",
								display: "flex",
								justifyContent: "space-between",
								position: "sticky",
								top: 0,
							}}
						>
							<Typography component="h1" variant="h5">
								The Second Tradition
							</Typography>
							<Tooltip title="Back to map">
								<Button
									onClick={closeDrawer}
									variant="contained"
									sx={{ minWidth: "auto", px: 1 }}
								>
									<MapIcon />
								</Button>
							</Tooltip>
						</Toolbar>
						<Container sx={{ marginTop: "24px" }}>
							<Grid
								component="ul"
								container
								spacing={3}
								paddingLeft="0"
								sx={{}}
							>
								{geojsonData.features.map((f: GeoJSON.Feature, i) => {
									if (!f.properties) return null;
									return (
										<Grid component="li" item key={f.properties.id} xs={12}>
											<FeatureCard featureData={f} {...featureCardFunctions} />
										</Grid>
									);
								})}
							</Grid>
						</Container>
						<Container>
							<a
								target="_blank"
								href="https://icons8.com/icon/92345/drop-of-blood"
							>
								Blood
							</a>{" "}
							icon by{" "}
							<a target="_blank" href="https://icons8.com">
								Icons8
							</a>
							<a
								target="_blank"
								href="https://icons8.com/icon/vurh7-um5eMM/drop-of-blood"
							>
								Blood
							</a>{" "}
							icons by{" "}
							<a target="_blank" href="https://icons8.com">
								Icons8
							</a>
						</Container>
					</Box>
				</SwipeableDrawer>
			</>
		</div>
	);
}
