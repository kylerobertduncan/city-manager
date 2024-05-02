import { styled, alpha } from "@mui/material/styles";
import Button from "@mui/material/Button";
import MapIcon from "@mui/icons-material/Map";
import Tooltip from "@mui/material/Tooltip";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";

const Search = styled("div")(({ theme }) => ({
	position: "relative",
	borderRadius: theme.shape.borderRadius,
	backgroundColor: alpha(theme.palette.common.white, 0.15),
	"&:hover": {
		backgroundColor: alpha(theme.palette.common.white, 0.25),
	},
	marginLeft: 0,
	width: "100%",
	[theme.breakpoints.up("sm")]: {
		marginLeft: theme.spacing(1),
		width: "auto",
	},
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
	padding: theme.spacing(0, 2),
	height: "100%",
	position: "absolute",
	pointerEvents: "none",
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
	color: "inherit",
	width: "100%",
	"& .MuiInputBase-input": {
		padding: theme.spacing(1, 1, 1, 0),
		// vertical padding + font size from searchIcon
		paddingLeft: `calc(1em + ${theme.spacing(4)})`,
		transition: theme.transitions.create("width"),
		[theme.breakpoints.up("sm")]: {
			width: "0ch",
			"&:focus": {
				width: "20ch",
			},
		},
	},
}));

export default function SidebarHeader({ desktop, setDrawerOpen }: { desktop: boolean; setDrawerOpen: (boolean: boolean) => void }) {
	return (
		<Toolbar
			sx={{
				bgcolor: "grey.900",
				display: "flex",
				justifyContent: "space-between",
				position: "sticky",
				top: 0,
				zIndex: 100,
			}}
		>
			<Typography
				variant='h5'
				noWrap
				component='h1'
				sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
			>
				The Second Tradition
			</Typography>
			{desktop ? null : (
				<Tooltip title='Back to map'>
					<Button onClick={() => setDrawerOpen(false)} variant='contained' sx={{ minWidth: "auto", px: 1 }}>
						<MapIcon />
					</Button>
				</Tooltip>
			)}
			<Search>
        <SearchIconWrapper>
          <SearchIcon />
        </SearchIconWrapper>
        <StyledInputBase
          placeholder="Search…"
          inputProps={{ "aria-label": "search" }}
        />
      </Search>
		</Toolbar>
	);
}
