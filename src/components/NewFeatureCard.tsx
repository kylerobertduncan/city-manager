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
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { MapController } from "../modules/mapController";

/*
  required functions:
  - deleteFeature
  - editFeature
*/

export default function FeatureCard({ feature, map }: { feature: GeoJSON.Feature, map: MapController }) {
  
  if (!feature.properties) return null;
  
  const { address, name, notes, tags } = feature.properties;

  
  
  return (
		<Card raised>
			<CardHeader
				avatar={
					<IconButton
						aria-label='View feature on map'
						// onClick={() => {
						// 	goToFeature(feature.properties!.center);
						// 	showFeaturePopup(feature.properties!);
						// }}
						size='small'
					>
						{feature.geometry.type === "Point" ? <PlaceIcon /> : <PolylineIcon />}
					</IconButton>
				}
				title={name ? name : "Location Name"}
				titleTypographyProps={{ component: "h2", variant: "h5" }}
				subheader={address ? address : "Subheader (address?) here"}
				action={
					<IconButton aria-label="Options" disabled size="small">
						<MoreVertIcon />
					</IconButton>
				}
			/>
			<CardContent>
				{/* switch tags and address? */}
				<Typography gutterBottom>{tags ? tags : "Tags"}</Typography>
				{/* Add collapse to show/hide notes and other details */}
				<Typography variant='body2'>{notes ? notes : "Notes"}</Typography>
			</CardContent>
			{/* move this to a pop out menu at top right */}
			<CardActions>
				<IconButton
					aria-label='Edit feature'
					// onClick={() => editFeature(feature)}
					size='small'
				>
					<EditIcon />
				</IconButton>
				<IconButton
					aria-label='Delete feature'
					// onClick={() => deleteFeature(feature.properties!.id)}
					size='small'
				>
					<DeleteIcon />
				</IconButton>
			</CardActions>
		</Card>
	);
}
