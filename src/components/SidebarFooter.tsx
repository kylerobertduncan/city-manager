import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

import FileOpenIcon from "@mui/icons-material/FileOpen";
import SaveIcon from "@mui/icons-material/Save";

import { LoadNewData } from "../fileManager";

export default function SidebarFooter({ save, load }: { save: () => void; load: (newGeojsonData: GeoJSON.FeatureCollection) => void }) {
	return (
		<Toolbar
			sx={{
				bgcolor: "grey.900",
				bottom: 0,
				justifyContent: "center",
				position: "sticky",
				zIndex: 100,
			}}>
			<Stack
				alignItems="center"
				justifyContent="center"
				direction="row"
				spacing={{ xs: 1, md: 2 }}>
				<Tooltip title="Save to disk">
					<Button
						onClick={save}
						variant="contained"
						sx={{
							minWidth: "auto",
							// p: 1,
						}}>
						<SaveIcon />
					</Button>
				</Tooltip>
				<Tooltip title="Load new data">
					<Button
						component="label"
						role={undefined}
						tabIndex={-1}
						variant="contained"
						sx={{
							minWidth: "auto",
							// p: 1,
						}}>
						<FileOpenIcon />
						<LoadNewData onImport={load} />
					</Button>
				</Tooltip>
				<Typography>Share Link</Typography>
				<Typography>Remove All</Typography>
				{/* <SharingSwitch geojsonData={geojsonData} /> */}
			</Stack>
		</Toolbar>
	);
}
