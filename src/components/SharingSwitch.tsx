import { ChangeEvent, useState } from "react";
import { addDoc, collection, doc, deleteDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";

import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";

import { db } from "../firestore";

import ShareDialog from "./ShareDialog";

export default function SharingSwitch({geojsonData}:{geojsonData:GeoJSON.FeatureCollection}) {

  const [sharing, setSharing] = useState(false);
  const [sharingID, setSharingID] = useState("");
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

	async function shareMap() {
		if (sharing) {
			window.alert("You're already sharing this map!");
			return;
		} else {
			try {
				const docRef = await addDoc(collection(db, "maps"), {
					created: Date.now(),
					geojson: JSON.stringify(geojsonData),
					uuid: uuid(),
        });
        console.log("document written with ID:", docRef.id);
				setSharingID(docRef.id);
				setShareDialogOpen(true);
			} catch (e) {
				console.error("error adding document", e);
			}
		}
  }
  
  async function handleChange(e:ChangeEvent<HTMLInputElement>) {
    // console.log("you flipped the switch!", "target:", e.target.checked, "state:", sharing);
    setSharing(e.target.checked)
    if (e.target.checked) shareMap();
    else {
      if (!window.confirm("Others will no longer be able to view this map. Proceed?")) {
        setSharing(true);
        return;
      }
      // add a delay here, in case of accidental stop
			// check local storage is up to date with firestore
			// remove data from firestore (and delete id/entry)
      await deleteDoc(doc(db, "maps", sharingID));
      // remove sharing ID, set sharing to false
      setSharing(false);
      setSharingID("");
		}
  }

	return (
		<>
			<FormGroup>
				<FormControlLabel control={<Switch checked={sharing} onChange={handleChange} inputProps={{ "aria-label": "controlled" }} />} label='Share Map' labelPlacement='start' />
			</FormGroup>
			{/* Share Map Dialog */}
			<ShareDialog closeDialog={() => setShareDialogOpen(false)} isOpen={shareDialogOpen} sharingID={sharingID} />
		</>
	);
}
