// import material ui components
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

export default function Toolbar({
	addPoint,
	clearAllData,
}: {
	addPoint: () => void;
	clearAllData: () => void;
}) {
	return (
		<Stack
			alignItems="center"
			direction="row"
			paddingY="12px"
			spacing={2}
			sx={{
				position: "absolute",
				bottom: 0,
				left: "50%",
				translate: "-50%",
			}}
		>
			<Button onClick={addPoint} variant="outlined">
				Add Point
			</Button>
			<Button variant="outlined">Add Polygon</Button>
			<Button onClick={clearAllData} variant="outlined">
				Clear Data
			</Button>
		</Stack>
	);
}
