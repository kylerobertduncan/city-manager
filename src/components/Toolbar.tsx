import { useState } from "react";
// import material ui components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

export default function Toolbar({
	addPoint,
	clearAllData,
}: {
	addPoint: () => void;
	clearAllData: () => void;
}) {
	
  // setup dialog handlers
	const [dialogOpen, setDialogOpen] = useState(false);
	const openDialog = () => setDialogOpen(true);
	const closeDialog = () => setDialogOpen(false);

  

	return (
		<>
			<Stack
				alignItems="center"
				direction="row"
				marginBottom="20px"
				spacing={2}
				sx={{
					bottom: 0,
					left: "50%",
					position: "absolute",
					translate: "-50%",
				}}
			>
				<Button onClick={addPoint} variant="contained">
					Add Point
				</Button>
				{/* <FormDialog addFeature={addPoint} title="Add Point"/> */}
				<Button variant="contained">Add Polygon</Button>
				<Button onClick={clearAllData} variant="contained">
					Clear Data
				</Button>
			</Stack>

			{/* modal form for feature properties */}
			<Dialog onClose={closeDialog} open={dialogOpen}>
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
					<Button variant="outlined">Add Feature</Button>
					<Button onClick={closeDialog} variant="outlined">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
