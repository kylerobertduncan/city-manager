// import material ui components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { featureProperties, emptyFeatureProperties } from "../variables";

export default function FeatureDialog({ geometry, handleAddFeature, handleCloseDialog, isOpen }: { geometry: GeoJSON.Point | GeoJSON.Polygon; handleAddFeature: (newFeature: GeoJSON.Feature) => void; handleCloseDialog: () => void; isOpen: boolean; }) {
	const [properties, setProperties] = useState<featureProperties>(emptyFeatureProperties);

	const updateProperties = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProperties({
			...properties,
			[e.target.name]: e.target.value,
		});
  };
  
  function closeDialog() {
    setProperties(emptyFeatureProperties);
    handleCloseDialog();
  }

	function handleSubmit() {
		// build feature
		const newFeature:GeoJSON.Feature = {
			type: "Feature",
			geometry: geometry,
			properties: {
				...properties,
				created: Date.now(),
				id: uuid(),
			},
    };
    handleAddFeature(newFeature);
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
