import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import IconButton from '@mui/material/IconButton';
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Typography from '@mui/material/Typography';
// import feature type icons
import PlaceIcon from '@mui/icons-material/Place';
import PolylineIcon from '@mui/icons-material/Polyline';
// import action button icons
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import FeatureDialog from "../components/EditFeatureDialog";

export default function FeatureCard({ feature, handleEdit, goTo, handleRemove }: {
  feature: GeoJSON.Feature;
  goTo: (properties: mapboxgl.EventData) => void;
  handleEdit: (feature: GeoJSON.Feature) => void;
  handleRemove: (uuid: string) => void;
}) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  
	if (!feature.properties) return null;
	
  const { address, name, notes, tags } = feature.properties;
  // menu setup
  const menuOpen = Boolean(anchorEl);
  const handleOpenMenu = (e:React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const handleCloseMenu = () => setAnchorEl(null);
  
  return (
		<>
			<Card raised>
				<CardHeader
					avatar={
						<IconButton
							aria-label="View feature on map"
							onClick={() => goTo(feature.properties!)}
							size="small">
							{feature.geometry.type === "Point" ? <PlaceIcon /> : <PolylineIcon />}
						</IconButton>
					}
					title={name ? name : "Location Name"}
					titleTypographyProps={{ component: "h2", variant: "h5" }}
					subheader={address ? address : "Subheader (address?) here"}
					action={
						<IconButton
							aria-label="Options"
							onClick={handleOpenMenu}>
							<MoreVertIcon />
						</IconButton>
					}
				/>
				<CardContent>
					{/* switch tags and address? */}
					<Typography gutterBottom>{tags ? tags : "Tags"}</Typography>
					{/* Add collapse to show/hide notes and other details */}
					<Typography variant="body2">{notes ? notes : "Notes"}</Typography>
				</CardContent>
				<Menu
					anchorEl={anchorEl}
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					transformOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					id="feature-menu"
					open={menuOpen}
					onClose={handleCloseMenu}
					MenuListProps={{
						"aria-labelledby": "feature-button",
					}}>
					{/* <MenuItem onClick={handleClose}>Profile</MenuItem>
          <MenuItem onClick={handleClose}>My account</MenuItem>
          <MenuItem onClick={handleClose}>Logout</MenuItem> */}
					<MenuItem>
						<IconButton
							aria-label="Edit feature"
							onClick={() => {
								handleCloseMenu();
								setDialogOpen(true);
								// edit(feature);
							}}
							size="small">
							<EditIcon />
						</IconButton>
					</MenuItem>
					<MenuItem>
						<IconButton
							aria-label="Delete feature"
							onClick={() => {
								handleCloseMenu();
								handleRemove(feature.properties!.id);
							}}
							size="small">
							<DeleteIcon />
						</IconButton>
					</MenuItem>
				</Menu>
			</Card>
			<FeatureDialog
				feature={feature}
				handleEditFeature={handleEdit}
				handleCloseDialog={() => setDialogOpen(false)}
				isOpen={dialogOpen}
			/>
		</>
	);
}
