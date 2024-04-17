// import material ui components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

import { featureProperties } from "../variables";
import { useState } from "react";
import { v4 as uuid } from "uuid";

export default function FeatureDialog({
  isOpen,
  handleCancel,
  handleSubmit
}: {
  isOpen: boolean;
  handleCancel: () => void;
  handleSubmit: () => void
  }) {
  
  function handleClose() {}
  
  const [properties, setProperties] = useState<featureProperties>({
    created: Date.now(),
    id: uuid(),
    name: "",
    tags: "",
    notes: ""
  });

  const updateProperties = (e:React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.name, e.target.value);
    setProperties({
      ...properties,
      [e.target.name]: e.target.value,
    });
  }

	return (
    <Dialog onClose={handleClose} open={isOpen}>
			<DialogTitle>Title</DialogTitle>
			<DialogContent>
				<DialogContentText>Instructions</DialogContentText>
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
					onClick={handleCancel}
					variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
