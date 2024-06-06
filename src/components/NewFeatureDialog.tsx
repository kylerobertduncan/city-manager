// import material ui components
import Autocomplete from '@mui/material/Autocomplete';
import Chip from '@mui/material/Chip';
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
        <Autocomplete
          defaultValue={properties.tags}
          freeSolo
          id="tags-filled"
          multiple
          onChange={(_, newValue) => {
            setProperties({
              ...properties,
              tags: newValue,
            })
          }}
          options={featureTags.map((t) => t)}
          renderTags={(value: readonly string[], getTagProps) =>
            value.map((option: string, index: number) => {
              const { key, ...tagProps } = getTagProps({ index });
              return (
                <Chip variant="outlined" label={option} key={key} {...tagProps} />
              );
            })
          }
          selectOnFocus
          clearOnBlur
          handleHomeEndKeys
          renderInput={(params) => (
            <TextField
              label="Tags"
              margin="dense"
              placeholder="add tags..."
              {...params}
            />
          )}
        />
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
