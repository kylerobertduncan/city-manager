import mapboxgl from "mapbox-gl";

import {
  mapboxSourceId,
  mapboxPointLayerId,
  mapboxPolygonLayerId,
  // newPolygonSource,
  // newPolygonPointLayer,
  // newPolygonLineLayer,
  // liveLineSource,
  // liveLineLayer
} from "../variables";

// add url restrictions before releasing production
// https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

export function init(center: mapboxgl.LngLatLike, container: any, setCenter: (lngLat: mapboxgl.LngLatLike) => void, setZoom: (number: number) => void, zoom: number) {
	// initialize new map
	const map = new mapboxgl.Map({
		container: container,
		style: "mapbox://styles/mapbox/dark-v10",
		center: center,
		zoom: zoom,
	});
	// setup map listeners for user movement
	map.on("move", () => {
		setCenter(map.getCenter());
		setZoom(map.getZoom());
	});
	return map;
}

export function addSource(geojsonData:GeoJSON.FeatureCollection, map:mapboxgl.Map) {
  if (!map.getSource(mapboxSourceId)) map.addSource(mapboxSourceId, {
    data: geojsonData,
    type: "geojson",
  });
}

export function addLayers(map: mapboxgl.Map) {
	if (map.getLayer(mapboxPointLayerId)) return;
	// add polygon layer
	map.addLayer(
		{
			filter: ["==", ["geometry-type"], "Polygon"],
			id: mapboxPolygonLayerId,
			source: mapboxSourceId,
			type: "fill",
			paint: {
				"fill-color": "red",
				"fill-opacity": 0.5,
			},
		},
		"land-structure-polygon"
	);
	// add polygon boundary layer
	map.addLayer(
		{
			filter: ["==", ["geometry-type"], "Polygon"],
			id: "mapboxPolygonLayerId-line",
			source: mapboxSourceId,
			type: "line",
			layout: {
				"line-cap": "round",
				"line-join": "round",
			},
			paint: {
				"line-color": "white",
				"line-opacity": 0.5,
				"line-width": 2.5,
			},
		},
		"land-structure-polygon"
	);
	// add point layer
	map.addLayer(
		{
			filter: ["==", ["geometry-type"], "Point"],
			id: mapboxPointLayerId,
			source: mapboxSourceId,
			type: "circle",
			paint: {
				"circle-color": "red",
				"circle-opacity": 0.5,
				"circle-radius": 10,
				"circle-stroke-color": "white",
				"circle-stroke-opacity": 0.5,
				"circle-stroke-width": 2.5,
			},
		},
		"road-label"
	);
	// add symbol layer
	// map.loadImage(markerImg, (e:mapboxgl.ErrorEvent, img:mapboxgl.ImageSource) => {
	//   if (e) throw e;
	//   map.addImage("marker", img, { sdf: true });
	// });
	// map.addLayer(
	// 	{
	// 		filter: ["==", ["geometry-type"], "Point"],
	// 		id: mapboxPointLayerId,
	// 		source: mapboxSourceId,
	// 		type: "symbol",
	// 		layout: {
	// 			"icon-allow-overlap": true,
	// 			"icon-anchor": "bottom",
	// 			"icon-image": "marker",
	// 		},
	// 		paint: {
	//       "icon-color": "yellow",
	//     },
	// 	},
	// 	"road-label"
	// );
	// add hidden trigger layer
	map.addLayer(
		{
			filter: ["==", ["geometry-type"], "Point"],
			id: `${mapboxPointLayerId}-trigger`,
			source: mapboxSourceId,
			type: "circle",
			paint: {
				"circle-color": "transparent",
				"circle-radius": 20,
			},
		},
		"road-label"
  );
  handleCursor(map);
}

// add cursor interactions
export function handleCursor(map: mapboxgl.Map) {
	map.on("mouseenter", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], () => (map.getCanvas().style.cursor = "pointer"));
	map.on("mouseleave", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], () => (map.getCanvas().style.cursor = ""));
	map.on("click", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], (e) => handleClick(e, map));
}

export function handleClick(e: mapboxgl.EventData, map: mapboxgl.Map) {
	// use center prop if available, or revert to click lngLat
	const center = e.features[0].properties.center ? JSON.parse(e.features[0].properties.center) : e.lngLat;
	goToFeature(center, map);
	showFeaturePopup(e.features[0].properties, map);
	// add handling for a click that captures multiple features
}

export function goToBounds(bounds: mapboxgl.LngLatBoundsLike, map: mapboxgl.Map) {
	map.fitBounds(bounds, { padding: 100 });
}

export function goToFeature(lngLat: mapboxgl.LngLatLike, map: mapboxgl.Map) {
	map.easeTo({
		center: lngLat,
		duration: 1000,
	});
}

export function showFeaturePopup(properties: mapboxgl.EventData, map: mapboxgl.Map) {
	if (!properties) return;
	// close other popups? multiple can be opened from sidebar
	const lngLat = typeof properties.center == "string" ? JSON.parse(properties.center) : properties.center;
	const popup = new mapboxgl.Popup({ anchor: "left" });
	popup.setLngLat(lngLat).setHTML(`<h2 style="color:black;">${properties.name}</h2>`).setMaxWidth("300px").addTo(map);
}
