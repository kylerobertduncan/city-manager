import mapboxgl from "mapbox-gl";
import Box from '@mui/material/Box';
import Button from "@mui/material/Button";
import Grid from '@mui/material/Grid';
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useRef, useEffect, useState } from 'react';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2lsb3JvbWVvZGVsdGEiLCJhIjoiY2xzMjdrZTFlMDg3eTJycWttNjVic2d5YSJ9.590rhaUsUXBdOYNAbPaHFw';

export default function Mapbox() {
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
    })
  });

  const [trackCursor, setTrackCursor] = useState(false)
  const [cursorLngLat, setCursorLngLat] = useState({lng: null, lat: null})

  function handleTrackCursor(e: any) {
    setCursorLngLat({lng: e.lngLat.lng.toFixed(4), lat: e.lngLat.lat.toFixed(4)});
  }

  useEffect(() => {
    console.log("useEffect: trackCursor is", trackCursor);
    if (trackCursor) {
      console.log("useEffect: turning on listener");
      map.current.on("mousemove", handleTrackCursor);
    }
    else {
      console.log("useEffect: turning off listener");
      map.current.off("mousemove", handleTrackCursor);
    }
    
  }, [trackCursor])

  function handleAddFeature() {
    setTrackCursor(!trackCursor);
  }

  /*
  On load, check localStorage for any existing features
  If present, add them to the map
  */

  return(
    <Grid component="main" item xs={12} lg={9}>
      <Box className='map-container' component="div" height="100vh" ref={mapContainer}>
      
        {/* lngLatZoom readout for dev only */}
        <Box className="floatingElement" sx={{ position:"absolute", top: 0, left: 0 }}>
          Center: Lng: {mapCenter.lng} | Lat: {mapCenter.lat} | Zoom: {zoom}
        </Box>

        <Box className="floatingElement" sx={{ position:"absolute", top: 0, right: 0 }}>
          Cursor: Lng: {cursorLngLat.lng} | Lat: {cursorLngLat.lat}
        </Box>
      
        {/* Add a button */}
        {/* On mouse click, save the coordinates as a GeoJSON feature in localStorage */}
        <Stack alignItems="center" className="floatingElement" direction="row" spacing={2} sx={{ position:"absolute", bottom: 0, left: "50%", translate:"-50%" }}>
          <Button onClick={handleAddFeature} variant="outlined">
            Add Feature
          </Button>
        </Stack>

      </Box>
    </Grid>
  )
}
