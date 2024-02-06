import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

export default function FeatureCard({
	featureData,
}: {
	featureData: GeoJSON.Feature;
}) {
  if (!featureData.properties) return null;
  const { address, id, name, notes} = featureData.properties;
	return (
		<Card raised>
			<CardContent>
				<Typography component="h2" variant="h5">
					Location Name
				</Typography>
        {/* add button to flyTo feature */}
        {/* add button to edit/change colour */}
				<Typography paragraph>Tags</Typography>
        {/* Add collapse to show/hide notes and other details */}
				<Typography paragraph variant="body2">
					Notes
				</Typography>
				<Typography fontSize={12}>ID: {featureData.properties.id}</Typography>
        {/* Replace ID with address (when available) */}
			</CardContent>
		</Card>
	);
}
