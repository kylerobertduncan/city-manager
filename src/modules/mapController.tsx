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

export function mapboxInit(center: mapboxgl.LngLatLike, container: any, setCenter: (lngLat: mapboxgl.LngLatLike) => void, setZoom: (number: number) => void, zoom: number) {
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

export class MapController {
	map: mapboxgl.Map;
	constructor(map: mapboxgl.Map) {
		this.map = map;
	}

	// adds the initial source
	setupSource(geojsonData: GeoJSON.FeatureCollection) {
    if (!this.map.getSource(mapboxSourceId)) {
			this.map.addSource(mapboxSourceId, {
				data: geojsonData,
				type: "geojson",
			});
      this.addLayers();
    }
	}

  // confirms that the source has been created and is loaded
	isSourceLoaded() {
		if (this.map.getSource(mapboxSourceId) && this.map.isSourceLoaded(mapboxSourceId)) return true;
		else return false;
	}

  // updates the data for the source
	setSourceData(geojsonData: GeoJSON.FeatureCollection) {
		const s = this.map.getSource(mapboxSourceId) as mapboxgl.GeoJSONSource;
		s.setData(geojsonData);
  }
  
  // checks the source is loaded before updating data
	updateSource(geojsonData: GeoJSON.FeatureCollection) {
    const checkSourceUpdates = (e: mapboxgl.EventData) => {
      if (e.sourceId === mapboxSourceId && e.isSourceLoaded) {
        this.map.off("sourcedata", checkSourceUpdates);
        this.setSourceData(geojsonData);
      }
    }
    if (this.isSourceLoaded()) this.setSourceData(geojsonData);
    else this.map.on("sourcedata", checkSourceUpdates);
	}

	addLayers() {
		if (this.map.getLayer(mapboxPointLayerId)) return;
		// add polygon layer
		this.map.addLayer(
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
		this.map.addLayer(
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
		this.map.addLayer(
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
		// this.map.loadImage(markerImg, (e:mapboxgl.ErrorEvent, img:mapboxgl.ImageSource) => {
		//   if (e) throw e;
		//   this.map.addImage("marker", img, { sdf: true });
		// });
		// this.map.addLayer(
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
		this.map.addLayer(
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
		this.handleCursor();
	}

	// change cursor to pointer over features/triggers, and respond to clicks
	handleCursor() {
		this.map.on("mouseenter", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], () => (this.map.getCanvas().style.cursor = "pointer"));
		this.map.on("mouseleave", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], () => (this.map.getCanvas().style.cursor = ""));
		this.map.on("click", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], this.handleClick);
	}

  // arrow function required for desired context
  handleClick = (e: mapboxgl.EventData) => {
    // use center prop if available, or revert to click lngLat
		const center = e.features[0].properties.center ? JSON.parse(e.features[0].properties.center) : e.lngLat;
    this.goToFeature(center);
		this.showFeaturePopup(e.features[0].properties);
		// add handling for a click that captures multiple features
	}

	goToBounds(bounds: mapboxgl.LngLatBoundsLike) {
		this.map.fitBounds(bounds, { padding: 100 });
	}

	goToFeature(lngLat: mapboxgl.LngLatLike) {
		this.map.easeTo({
			center: lngLat,
			duration: 1000,
		});
	}

	showFeaturePopup(properties: mapboxgl.EventData) {
		if (!properties) return;
		// close other popups? multiple can be opened from sidebar
		const lngLat = typeof properties.center == "string" ? JSON.parse(properties.center) : properties.center;
		const popup = new mapboxgl.Popup({ anchor: "left" });
		popup.setLngLat(lngLat).setHTML(`<h2 style="color:black;">${properties.name}</h2>`).setMaxWidth("300px").addTo(this.map);
	}
}
