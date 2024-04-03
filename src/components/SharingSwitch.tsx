import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

export default function SharingSwitch() {
  return (
		<FormGroup>
			<FormControlLabel control={<Switch />} label='Share Map' labelPlacement='start' />
		</FormGroup>
	);
}
