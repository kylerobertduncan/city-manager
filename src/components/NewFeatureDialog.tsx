// import material ui components
// import { Theme, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { FormControl } from '@mui/material';
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { MuiColorInput } from "mui-color-input";
import { useState } from "react";
import { v4 as uuid } from "uuid";
import { featureTags, featureProperties, emptyFeatureProperties } from "../variables";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 7 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

export default function FeatureDialog({
  geometry,
  handleAddFeature,
  handleCloseDialog,
  isOpen
}: {
  geometry: GeoJSON.Point | GeoJSON.Polygon;
  handleAddFeature: (newFeature: GeoJSON.Feature) => void;
  handleCloseDialog: () => void;
  isOpen: boolean;
}) {
	const [properties, setProperties] = useState<featureProperties>(emptyFeatureProperties);

  const updateProperties = (e: React.ChangeEvent<HTMLInputElement>) => {
		setProperties({
			...properties,
			[e.target.name]: e.target.value,
		});
  };

  const updateColor = (updatedColor: string) =>
		setProperties({
			...properties,
			color: updatedColor,
		});
  
  function closeDialog() {
    setProperties(emptyFeatureProperties);
    handleCloseDialog();
  }

	function handleSubmit() {
		// build feature
		const newFeature:GeoJSON.Feature = {
			type: "Feature",
			geometry: geometry,
			properties: {
				...properties,
				created: Date.now(),
				id: uuid(),
			},
    };
    handleAddFeature(newFeature);
		closeDialog();
	}

  const updateChips = (event: SelectChangeEvent<typeof properties.tags>) => {
    const {
      target: { value },
    } = event;
    setProperties({
      ...properties,
      tags: typeof value === 'string' ? value.split(',') : value,
    })
  };

	return (
		<Dialog
			onClose={closeDialog}
			open={isOpen}>
			<DialogTitle>Add New Feature</DialogTitle>
			<DialogContent>
				<DialogContentText>Add some details about your new feature.</DialogContentText>
				<TextField
					autoFocus
					required
					margin="dense"
					id="name"
					name="name"
					label="Name"
					fullWidth
					value={properties.name}
					onChange={updateProperties}
				/>
        <FormControl margin="dense" sx={{ width:"100% "}}>
          <InputLabel id="tags-label">Chips</InputLabel>
          <Select
            name="tags"
            fullWidth
            labelId="tags-label"
            id="tags"
            multiple
            value={properties.tags}
            onChange={updateChips}
            input={<OutlinedInput id="select-multiple-tags" label="Tags" />}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {featureTags.map((name) => (
              <MenuItem
                key={name}
                value={name}
              >
                {name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
				<TextField
					margin="dense"
					id="byline"
					name="byline"
					label="Byline"
					fullWidth
					value={properties.byline}
					onChange={updateProperties}
				/>
				<TextField
					multiline
					margin="dense"
					id="notes"
					name="notes"
					label="Notes"
					fullWidth
					minRows={3}
					value={properties.notes}
					onChange={updateProperties}
				/>
				<MuiColorInput
					margin="dense"
					id="color"
					name="color"
					label="Color"
					fullWidth
					onChange={updateColor}
					format="hex"
					value={properties.color ? properties.color : "#ff0000"}
          fallbackValue="#ff0000"
				/>
			</DialogContent>
			<DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
				<Button
					onClick={handleSubmit}
					variant="outlined">
					Submit
				</Button>
				<Button
					onClick={closeDialog}
					variant="outlined">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
