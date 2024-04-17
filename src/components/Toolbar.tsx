// import material ui icons
// import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ExploreIcon from '@mui/icons-material/Explore'; // better icon for selecting?
// import FileOpenIcon from "@mui/icons-material/FileOpen";
import PlaceIcon from '@mui/icons-material/Place';
import PolylineIcon from '@mui/icons-material/Polyline';
// import RouteIcon from "@mui/icons-material/Route";
// import SaveIcon from "@mui/icons-material/Save";
// material UI components
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Tooltip from '@mui/material/Tooltip';
import mapboxgl from 'mapbox-gl';
// react components
import { useState } from 'react';
import { MapController } from '../modules/mapController';
import FeatureDialog from './NewFeatureDialog';

export default function Toolbar({ map }: { map: MapController }) {
  const [activeTool, setActiveTool] = useState('select');
  const [newFeatureDialogOpen, setNewFeatureDialogOpen] = useState(true);
	const [newPointCoordinates, setNewPointCoordinates] = useState<mapboxgl.LngLatLike>([0, 0]);

	function turnOffListeners() {
    map.mapbox.off('click', addPointFeature);
    // turn off polygon listener
    map.defaultCursor();
	}

	function handleToolChange(_: React.MouseEvent, v: string) {
		setActiveTool(v);
    console.log('tool changed to', v);
    turnOffListeners();
    switch (v) {
			case 'select': {
				break;
			}
      case 'point': {
        map.pointerCursor();
				map.mapbox.once('click', addPointFeature);
				break;
			}
			case 'polygon': {
				break;
			}
			default:
				throw Error('Unknown tool: ' + v);
		}
		// set cursor as appropriate
		// remove other tool listeners
		// add relevant listener
	}

	function addPointFeature(e: mapboxgl.EventData) {
		// center map on click
		map.goToFeature(e.lngLat);
		// open dialog - different dialogs for create/edit?
		// one here, one in sidebar?
		// capture properties
		// GeojsonContext dispatch ("addedPoint") with coordinates and properties
		// pass function to the dialog window for onSubmit
		// as well as a function for cancel
	}

	return (
		<>
			<ToggleButtonGroup
				aria-label='Select active tool'
				exclusive
				// onChange={(_, v) => setActiveTool(v)}
				onChange={handleToolChange}
				// size={xs:"small"; md: "medium"}
				value={activeTool}
				sx={{
					// add a bgcolor/fill?
					bottom: {
						xs: 'auto',
						md: 20,
					},
					left: '50%',
					top: {
						xs: 10,
						md: 'auto',
					},
					position: 'absolute',
					translate: '-50%',
				}}>
				<Tooltip title='Select a Feature'>
					<ToggleButton
						aria-label=''
						value={'select'}>
						<ExploreIcon />
					</ToggleButton>
				</Tooltip>
				<Tooltip title='Add a Point Feature'>
					<ToggleButton
						aria-label=''
						value={'point'}>
						<PlaceIcon />
					</ToggleButton>
				</Tooltip>
				<Tooltip title='Add a Polygon Feature'>
					<ToggleButton
						aria-label=''
						value={'polygon'}>
						<PolylineIcon />
					</ToggleButton>
				</Tooltip>
			</ToggleButtonGroup>
      {/* feature dialog to collect properties */}
      <FeatureDialog isOpen={newFeatureDialogOpen} handleCancel={() => setNewFeatureDialogOpen(false)} handleSubmit={() => setNewFeatureDialogOpen(false)}/>
		</>
	);
}
