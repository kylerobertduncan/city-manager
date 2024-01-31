import mapboxgl from "mapbox-gl";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useRef, useEffect, useState } from 'react';

mapboxgl.accessToken = 'pk.eyJ1Ijoia2lsb3JvbWVvZGVsdGEiLCJhIjoiY2xzMjdrZTFlMDg3eTJycWttNjVic2d5YSJ9.590rhaUsUXBdOYNAbPaHFw';

export default function Mapbox() {
  const mapContainer: any = useRef(null);
  const map: any = useRef(null);
  const [lng, setLng] = useState(-79.35);
  const [lat, setLat] = useState(43.68);
  const [zoom, setZoom] = useState(11);

  useEffect(() => {
    // initialize map only once
    if (map.current) return;
    // initialize new map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v10',
      center: [lng, lat],
      zoom: zoom
    });
    // setup map movement by user
    map.current.on("move", () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
    })
  });

  return(
    <Grid component="main" item xs={12} lg={9}>
      <Box className="sidebar" sx={{ position:"absolute", top: 0, left: 0 }}>
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </Box>
        <Box className='map-container' component="div" ref={mapContainer}></Box>
    </Grid>
  )
}
