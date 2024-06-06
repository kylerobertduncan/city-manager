import { ChangeEvent, useState } from "react";
import { addDoc, collection, doc, deleteDoc } from "firebase/firestore";
import { v4 as uuid } from "uuid";

import Button from "@mui/material/Button";
import ShareIcon from "@mui/icons-material/Share";
// import IosShareIcon from "@mui/icons-material/IosShare";
import Switch from "@mui/material/Switch";
import Tooltip from "@mui/material/Tooltip";

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
        console.debug("document written with ID:", docRef.id);
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
      <Tooltip title="Get Sharing Link">
        <Button
          // onClick={save}
          variant="contained"
          sx={{
            minWidth: "auto",
            p: 1,
          }}>
          <ShareIcon />
        </Button>
      </Tooltip>
      <Tooltip title="Turn Sharing On/Off">
        <Switch
        checked={sharing} onChange={handleChange} inputProps={{ "aria-label": "controlled" }}
        />
      </Tooltip>
			{/* Share Map Dialog */}
			<ShareDialog closeDialog={() => setShareDialogOpen(false)} isOpen={shareDialogOpen} sharingID={sharingID} />
		</>
	);
}
