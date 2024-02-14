// import * as React from "react";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function FormDialog({ addFeature, title }: { addFeature: () => void, title: string }) {
	// setup dialog handlers
  const [open, setOpen] = useState(false);
	const openDialog = () => setOpen(true);
	const closeDialog = () => setOpen(false);

  // listen for initial click
  const handleClick = () => {

  }

	return (
		<>
			<Button variant="outlined" onClick={openDialog}>
				{title}
			</Button>

			<Dialog
				open={open}
				onClose={closeDialog}
				PaperProps={{
					component: "form",
					onSubmit: (event: React.FormEvent<HTMLFormElement>) => {
						event.preventDefault();
						const formData = new FormData(event.currentTarget);
						const formJson = Object.fromEntries((formData as any).entries());
						console.log(formJson);
            addFeature();
						closeDialog();
					},
				}}
			>
				<DialogTitle component="h2" variant="h3">
					{title}
				</DialogTitle>

				<DialogContent>
					<DialogContentText>
						Enter the details of your new feature:
					</DialogContentText>

					<TextField
						autoFocus
						required
						margin="dense"
						id="name"
						name="name"
						label="Name"
						fullWidth
					/>
					<TextField
						margin="dense"
						id="tags"
						name="tags"
						label="Tags"
						fullWidth
					/>
					<TextField
						multiline
						margin="dense"
						id="notes"
						name="notes"
						label="Notes"
						fullWidth
						minRows={3}
					/>
				</DialogContent>

				<DialogActions>
					<Button type="submit" variant="outlined">
						Add Feature
					</Button>
					<Button onClick={closeDialog} variant="outlined">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
