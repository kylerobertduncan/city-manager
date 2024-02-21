// import material ui components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";

/* modal form for adding feature properties */
export default function AddFeatureDialog({
	isOpen,
	nameValue,
	tagsValue,
	notesValue,
	nameSetter,
	tagsSetter,
	notesSetter,
	handleAddFeature,
	handleClose,
}: {
	isOpen: boolean;
	nameValue: string;
	tagsValue: string;
	notesValue: string;
	nameSetter: (value: string) => void;
	tagsSetter: (value: string) => void;
	notesSetter: (value: string) => void;
	handleAddFeature: () => void;
	handleClose: () => void;
}) {
	return (
		<Dialog onClose={handleClose} open={isOpen}>
			<DialogTitle>New Feature Properties</DialogTitle>

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
					value={nameValue}
					onChange={(e) => nameSetter(e.target.value)}
				/>
				<TextField
					margin="dense"
					id="tags"
					name="tags"
					label="Tags"
					fullWidth
					value={tagsValue}
					onChange={(e) => tagsSetter(e.target.value)}
				/>
				<TextField
					multiline
					margin="dense"
					id="notes"
					name="notes"
					label="Notes"
					fullWidth
					minRows={3}
					value={notesValue}
					onChange={(e) => notesSetter(e.target.value)}
				/>
			</DialogContent>

			<DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
				<Button onClick={handleAddFeature} variant="outlined">
					Add Feature
				</Button>
				<Button onClick={handleClose} variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
