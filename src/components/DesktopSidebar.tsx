import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

// import SidebarHeader from "./SidebarHeader";

import SharingSwitch from "./SharingSwitch";
import FeatureCard from "./FeatureCard";

export default function Sidebar({
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
	return (
		<Grid
			component='aside'
			item
			maxHeight='100vh'
			position='relative'
			xs={12}
			md={4}
			lg={3}
			sx={{
				overflowY: "scroll",
				display: {
					xs: "none",
					md: "block",
				},
			}}
		>
			{/* <SidebarHeader /> */}
			<Toolbar
				sx={{
					bgcolor: "grey.900",
					display: "flex",
					justifyContent: "space-between",
					position: "sticky",
					top: 0,
				}}
			>
				<Typography component='h1' variant='h5'>
					Title
				</Typography>
        <SharingSwitch geojsonData={geojsonData} />
			</Toolbar>
			<Container sx={{ marginTop: "24px" }}>
				<Grid component='ul' container spacing={3} paddingLeft='0' sx={{}}>
					{geojsonData.features.map((f: GeoJSON.Feature, i) => {
						// console.log(f.properties);
						if (!f.properties) return null;
						return (
							<Grid component='li' item key={f.properties.id} xs={12}>
								<FeatureCard featureData={f} {...featureCardFunctions} />
							</Grid>
						);
					})}
				</Grid>
			</Container>
		</Grid>
	);
}
