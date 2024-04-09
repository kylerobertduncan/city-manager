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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
// local components
import FeatureCard from "./NewFeatureCard";
// import SidebarHeader from "./SidebarHeader";
// loa=cal modules
import { MapController } from "../modules/mapController";

export default function Sidebar({ geojsonData, map }: { geojsonData: GeoJSON.FeatureCollection; map: MapController }) {
	// establish screen size
	const theme = useTheme();
	// should this be in state?
  const desktop = useMediaQuery(theme.breakpoints.up("md"));

  if (desktop) {
		return (
			// desktop sidebar
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
					{/* <SharingSwitch geojsonData={geojsonData} /> */}
				</Toolbar>
        {/* feature cards */}
        <Container sx={{ marginTop: "24px" }}>
          <Grid component='ul' container spacing={3} paddingLeft='0' sx={{}}>
            {geojsonData.features.map((f: GeoJSON.Feature) => {
              if (!f.properties) return null;
              return (
                <Grid component='li' item key={f.properties.id} xs={12}>
                  <FeatureCard feature={f} map={map} />
                </Grid>
              );
            })}
          </Grid>
        </Container>
			</Grid>
		);
  } else {
    const [drawerOpen, setDrawerOpen] = useState(false);
		const openDrawer = () => setDrawerOpen(true);
		const closeDrawer = () => setDrawerOpen(false);
    return (
      // mobile sidebar
      <></>
    );
  }
    
}
