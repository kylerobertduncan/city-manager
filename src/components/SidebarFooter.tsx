import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import FileOpenIcon from "@mui/icons-material/FileOpen";
import SaveIcon from "@mui/icons-material/Save";
import ShareIcon from "@mui/icons-material/Share";
// import IosShareIcon from "@mui/icons-material/IosShare";

import { LoadNewData } from "../fileManager";
import SharingSwitch from "./SharingSwitch";
import { prxsFile } from "../variables";

export default function SidebarFooter({
  geojsonData,
  save,
  load,
  removeAll
}: {
  geojsonData: prxsFile;
  save: () => void;
  load: (newGeojsonData: prxsFile) => void;
  removeAll: () => void;
}) {
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
				<Tooltip title="Delete All">
					<Button
						onClick={removeAll}
						variant="contained"
						sx={{
							minWidth: "auto",
							p: 1,
						}}>
						<DeleteForeverIcon />
					</Button>
				</Tooltip>
				<Tooltip title="Save To Disk">
					<Button
						onClick={save}
						variant="contained"
						sx={{
							minWidth: "auto",
							p: 1,
						}}>
						<SaveIcon />
					</Button>
				</Tooltip>
				<Tooltip title="Load New Data">
					<Button
						component="label"
						role={undefined}
						tabIndex={-1}
						variant="contained"
						sx={{
							minWidth: "auto",
							p: 1,
						}}>
						<FileOpenIcon />
						<LoadNewData onImport={load} />
					</Button>
				</Tooltip>
        <SharingSwitch geojsonData={geojsonData} />
			</Stack>
		</Toolbar>
	);
}
