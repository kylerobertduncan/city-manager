import { useEffect, useState } from 'react';
import './App.css';
import Grid from '@mui/material/Grid';
import MapWindow from './components/MapWindow';
import Sidebar from './components/Sidebar';
import { localStorageId } from "./utils/variables"

function App() {

  const [ data, setData ] = useState<GeoJSON.FeatureCollection>({
    type: "FeatureCollection",
    features: []
  });
  useEffect(() => {
    const item = localStorage.getItem(localStorageId);
    if (!item) return; // throw error? or run itemSetup function
    const data = JSON.parse(item);
    if (data) setData(data);
  }, [])
  console.log("Retrieved localStorage on page load, now in state:", data);

  return (
    <Grid container className="App">
      <MapWindow data={data} />
      <Sidebar data={data} />
    </Grid>
  );
}

export default App;
