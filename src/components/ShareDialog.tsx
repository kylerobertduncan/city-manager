// import material ui components
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface shareProperties {
	closeDialog: () => void;
  isOpen: boolean;
  sharingID: string;
}

export default function ShareDialog({
	closeDialog,
  isOpen,
  sharingID,
}: shareProperties) {

  if (sharingID) console.log(sharingID, "is in the dialog!");
  
	return (
		<Dialog onClose={closeDialog} open={isOpen}>
			<DialogTitle>Share Map</DialogTitle>
			<DialogContent>
				<DialogContentText>
					You wanna map share?
				</DialogContentText>
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
				<Button onClick={closeDialog} variant="outlined">
					Submit
				</Button>
				<Button onClick={closeDialog} variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
