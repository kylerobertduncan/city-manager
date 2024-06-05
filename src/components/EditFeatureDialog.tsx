// import material ui components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { MuiColorInput } from "mui-color-input";
import { useState } from "react";
import { featureProperties } from "../variables";

export default function FeatureDialog({
  feature,
  handleEditFeature,
  handleCloseDialog,
  isOpen
}: {
  feature: GeoJSON.Feature;
  handleEditFeature: (updatedFeature: GeoJSON.Feature) => void;
  handleCloseDialog: () => void;
  isOpen: boolean
}) {
  
	const [properties, setProperties] = useState<featureProperties>(feature.properties as featureProperties);

	const updateProperties = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProperties({
			...properties,
			[e.target.name]: e.target.value,
		});
  };
  
  const updateColor = (updatedColor: string) => setProperties({
    ...properties,
    color: updatedColor
  });

	function closeDialog() {
		// setProperties(emptyFeatureProperties);
		handleCloseDialog();
	}

  function handleSubmit() {
    const updatedFeature = { ...feature }
    updatedFeature.properties = {...properties}
		handleEditFeature(updatedFeature);
		closeDialog();
	}

	return (
		<Dialog
			onClose={closeDialog}
			open={isOpen}>
			<DialogTitle>Add New Feature</DialogTitle>
			<DialogContent>
				<DialogContentText>Add some details about your new feature.</DialogContentText>
				<TextField
					autoFocus
					required
					margin="dense"
					id="name"
					name="name"
					label="Name"
					fullWidth
					value={properties.name}
					onChange={updateProperties}
				/>
				<TextField
					margin="dense"
					id="tags"
					name="tags"
					label="Tags"
					fullWidth
					value={properties.tags}
					onChange={updateProperties}
				/>
				<TextField
					multiline
					margin="dense"
					id="notes"
					name="notes"
					label="Notes"
					fullWidth
					minRows={3}
					value={properties.notes}
					onChange={updateProperties}
				/>
				<MuiColorInput
          isAlphaHidden
					margin="dense"
					id="color"
					name="color"
					label="Color"
					fullWidth
					onChange={updateColor}
					format="hex"
					value={properties.color ? properties.color : "#ff0000"}
          fallbackValue="#ff00000"
				/>
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
				<Button
					onClick={handleSubmit}
					variant="outlined">
					Submit
				</Button>
				<Button
					onClick={closeDialog}
					variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
