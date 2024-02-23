import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
// import feature type icons
import PlaceIcon from "@mui/icons-material/Place";
import PolylineIcon from "@mui/icons-material/Polyline";
// import action button icons
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
// import ExpandCircleDownIcon from "@mui/icons-material/ExpandCircleDown";
import MyLocationIcon from "@mui/icons-material/MyLocation";

export default function FeatureCard({
	featureData,
	goToFeature,
}: {
	featureData: GeoJSON.Feature;
	goToFeature: (e: GeoJSON.Position) => void;
}) {
	if (!featureData.properties) return null;
	// console.log(featureData);

	const { address, id, name, notes, tags } = featureData.properties;
	return (
		<Card raised>
			<CardHeader
				avatar={
					featureData.geometry.type === "Point" ? (
						<PlaceIcon />
					) : (
						<PolylineIcon />
					)
				}
				title={name ? name : "Location Name"}
				titleTypographyProps={{ component: "h2", variant: "h5" }}
				subheader={address ? address : null}
			/>
			<CardContent>
				<Typography gutterBottom>{tags ? tags : "Tags"}</Typography>
				{/* Add collapse to show/hide notes and other details */}
				<Typography variant="body2">{notes ? notes : "Notes"}</Typography>
				{/* <Typography fontSize={12}>ID: {id}</Typography> */}
				{/* Replace ID with address (when available) */}
			</CardContent>
			<CardActions>
				<IconButton aria-label="View feature on map" onClick={() => goToFeature(featureData.properties!.center)}>
					<MyLocationIcon />
				</IconButton>
				<IconButton aria-label="Edit feature">
					<EditIcon />
				</IconButton>
				<IconButton aria-label="Delete feature">
					<DeleteIcon />
				</IconButton>
				{/* <IconButton disabled>
          <ExpandCircleDownIcon />
        </IconButton> */}
			</CardActions>
		</Card>
	);
}
