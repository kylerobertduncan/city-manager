// import material ui components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { featureProperties } from "../variables";

interface dialogProperties {
	closeDialog: () => void;
	featureProperties: featureProperties;
	instruction?: string;
	isOpen: boolean;
	returnProperties: (properties: featureProperties) => void;
	title?: string;
	updateProperties: (property: string, value: string) => void;
}

export default function FeatureDialog({
	closeDialog,
	featureProperties,
	instruction,
	isOpen,
	returnProperties,
	title,
  updateProperties,
}: dialogProperties) {

	function handleReturn() {
		returnProperties(featureProperties);
		closeDialog();
	}

	return (
		<Dialog onClose={closeDialog} open={isOpen}>
			<DialogTitle>{title ? title : "Feature Properties"}</DialogTitle>
			<DialogContent>
				<DialogContentText>
					{instruction ? instruction : "Details for this feature:"}
				</DialogContentText>
				<TextField
					autoFocus
					required
					margin="dense"
					id="name"
					name="name"
					label="Name"
					fullWidth
					value={featureProperties.name}
					onChange={(e) => updateProperties("name", e.target.value)}
				/>
				<TextField
					margin="dense"
					id="tags"
					name="tags"
					label="Tags"
					fullWidth
					value={featureProperties.byline}
					onChange={(e) => updateProperties("tags", e.target.value)}
				/>
				<TextField
					multiline
					margin="dense"
					id="notes"
					name="notes"
					label="Notes"
					fullWidth
					minRows={3}
					value={featureProperties.notes}
					onChange={(e) => updateProperties("notes", e.target.value)}
				/>
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
				<Button onClick={handleReturn} variant="outlined">
					Submit
				</Button>
				<Button onClick={closeDialog} variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
