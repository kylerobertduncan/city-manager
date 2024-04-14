// import material ui icons
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExploreIcon from "@mui/icons-material/Explore"; // better icon for selecting?
import FileOpenIcon from "@mui/icons-material/FileOpen";
import PlaceIcon from "@mui/icons-material/Place";
import PolylineIcon from "@mui/icons-material/Polyline";
import RouteIcon from "@mui/icons-material/Route";
import SaveIcon from "@mui/icons-material/Save";
// material UI components
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import Tooltip from "@mui/material/Tooltip";
// react components
import { useState } from "react";

export default function Toolbar() {
	const [activeTool, setActiveTool] = useState("select");

	return (
		<ToggleButtonGroup
      aria-label='Select active tool'
			exclusive
      onChange={(_, v) => setActiveTool(v)}
      // size={xs:"small"; md: "medium"}
      value={activeTool}
      sx={{
        // add a bgcolor/fill?
        bottom: {
					xs: "auto",
					md: 20,
				},
				left: "50%",
				top: {
					xs: 10,
					md: "auto",
				},
				position: "absolute",
				translate: "-50%",
			}}
		>
			<Tooltip title='Select a Feature'>
				<ToggleButton aria-label="" value={"select"}>
					<ExploreIcon />
				</ToggleButton>
			</Tooltip>
			<Tooltip title='Add a Point Feature'>
				<ToggleButton aria-label="" value={"point"}>
					<PlaceIcon />
				</ToggleButton>
			</Tooltip>
			<Tooltip title='Add a Polygon Feature'>
				<ToggleButton aria-label="" value={"polygon"}>
					<PolylineIcon />
				</ToggleButton>
			</Tooltip>
		</ToggleButtonGroup>
	);
}
