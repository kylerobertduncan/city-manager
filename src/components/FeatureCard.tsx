import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function FeatureCard({
	featureData,
}: {
	featureData: GeoJSON.Feature;
}) {
  if (!featureData.properties) return null;
  console.log(featureData.properties);
  
  const { address, id, name, notes, tags} = featureData.properties;
	return (
		<Card raised>
			<CardContent>
				<Typography component="h2" variant="h5">
					{name ? name : "Location Name"}
				</Typography>
        {/* add button to flyTo feature */}
        {/* add button to edit/change colour */}
				<Typography gutterBottom>
          {tags ? tags : "Tags"}
        </Typography>
        {/* Add collapse to show/hide notes and other details */}
				<Typography variant="body2">
					{notes ? notes : "Notes"}
				</Typography>
				{/* <Typography fontSize={12}>ID: {id}</Typography> */}
        {/* Replace ID with address (when available) */}
			</CardContent>
		</Card>
	);
}
