import mapboxgl from "mapbox-gl";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";
// import Typography from "@mui/material/Typography";

import { useRef, useEffect, useState } from 'react';

import { addPointFeature, getLocalStorage, clearLocalStorage } from "../utils/localStorage";
import { addSource, addLayer, zoomToAll } from "../utils/mapbox";

// add url restrictions before releasing production: https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
mapboxgl.accessToken = (process.env.REACT_APP_MAPBOX_API_KEY as string);

export default function MapWindow() {
  const mapContainer: any = useRef(null);
  const map: any = useRef(null);
  const [zoom, setZoom] = useState(11);

  const [mapCenter, setMapCenter] = useState({lng: -79.35, lat: 43.68})

  useEffect(() => {
    // initialize map only once
    if (map.current) return;
    // initialize new map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [mapCenter.lng, mapCenter.lat],
      zoom: zoom
    });
    // setup map movement by user
    map.current.on("move", () => {
      const c = map.current.getCenter()
      setMapCenter({lng: c.lng.toFixed(4), lat: c.lat.toFixed(4)});
      setZoom(map.current.getZoom().toFixed(2));
    });
    // get local storage object
    console.log("current data in storage:", getLocalStorage());
    // On load, check localStorage for any existing features
    // If present, add them to the map
    map.current.on("load", () => {
      addSource(map.current);
      addLayer(map.current);
      zoomToAll(map.current);
    })
  });


  // store click lngLat in state to display (dev only)
  const [ featureLngLat, setFeatureLngLat ] = useState({lng: 0, lat: 0});
  // listen for click; get lngLat and save
  function addPoint() {
    map.current.once("click", (e:mapboxgl.EventData) => addPointFeature(e.lngLat));
  }

  return(
    <Grid component="main" item xs={12} lg={9}>
      <Box className='map-container' component="div" height="100vh" ref={mapContainer}>
      
        {/* lngLatZoom readout for dev only */}
        <Box className="floatingElement" sx={{ position:"absolute", top: 0, left: 0 }}>
          Center: Lng: {mapCenter.lng} | Lat: {mapCenter.lat} | Zoom: {zoom}
        </Box>

        <Box className="floatingElement" sx={{ position:"absolute", top: 0, right: 0 }}>
          Click: Lng: {featureLngLat.lng} | Lat: {featureLngLat.lat}
        </Box>
      
        <Stack alignItems="center" className="floatingElement" direction="row" spacing={2} sx={{ position:"absolute", bottom: 0, left: "50%", translate:"-50%" }}>
          {/* On mouse click, save the coordinates as a GeoJSON feature in localStorage */}
          <Button onClick={addPoint} variant="outlined">Add Point</Button>
          <Button variant="outlined">Add Polygon</Button>
          <Button onClick={clearLocalStorage} variant="outlined">Delete All</Button>
        </Stack>

      </Box>
    </Grid>
  )
}
