import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import SidebarHeader from "./SidebarHeader";
// import Typography from '@mui/material/Typography';

import FeatureCard from "./FeatureCard";

/*
On load, check localStorage for any existing features
If present, add them to the sidebar
*/

export default function Sidebar({
	geojsonData,
}: {
	geojsonData: GeoJSON.FeatureCollection;
}) {
	return (
		<Grid
			component="aside"
			item
			maxHeight="100vh"
			xs={12}
			md={4}
			lg={3}
			sx={{ overflowY: "scroll" }}
		>
			<SidebarHeader />
			<Container sx={{ marginTop: "24px" }}>
				<Grid component="ul" container spacing={3} paddingLeft="0" sx={{}}>
					{geojsonData.features.map((f: GeoJSON.Feature, i) => {
						// console.log(f.properties);
						if (!f.properties) return;
						return (
							<Grid component="li" item key={f.properties.id} xs={12}>
								<FeatureCard featureData={f} />
							</Grid>
						);
					})}
				</Grid>
			</Container>
		</Grid>
	);
}
