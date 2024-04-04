import { useLoaderData } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firestore";

export async function shareLoader({ params }:{params: any}) {
  const sharingID = await params.sharingID;
  return { sharingID };
}

export default function SharedMap() {

  const { sharingID } = useLoaderData() as { sharingID: string };
  
  console.log("sharing map at id:", sharingID);
  
  const unsubscribe = onSnapshot(doc(db, "maps", sharingID), (doc) => {
    // console.log("Current data: ", doc.data());
    const data = doc.data();
    console.log("geojson data:", JSON.parse(data?.geojson))
  });
  
  // handle unsubscribe on unmount

  return <h1>Viewing map with ID: {sharingID}</h1>;
}
