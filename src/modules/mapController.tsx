import mapboxgl from "mapbox-gl";

import {
  mapboxSourceId,
  mapboxPointLayerId,
  mapboxPolygonLayerId,
  featureProperties,
  newPolygonSource,
  newPolygonPointLayer,
  newPolygonLineLayer,
  newPolygonFeatureCollection,
  liveLineSource,
  liveLineLayer
} from "../variables";

import MapboxPopup from "../components/MapboxPopup";

// add url restrictions before releasing production
// https://docs.mapbox.com/accounts/guides/tokens/#url-restrictions
mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_API_KEY as string;

export function mapboxInit(center: mapboxgl.LngLatLike, container: any, setCenter: (lngLat: mapboxgl.LngLatLike) => void, setZoom: (number: number) => void, zoom: number) {
	// initialize new map
	const mapbox = new mapboxgl.Map({
		container: container,
		style: "mapbox://styles/mapbox/dark-v10",
		center: center,
		zoom: zoom,
	});
	// setup map listeners for user movement
	mapbox.on("move", () => {
		setCenter(mapbox.getCenter());
		setZoom(mapbox.getZoom());
	});
	return mapbox;
}

export class MapController {
	mapbox: mapboxgl.Map;
	liveLine: {
		first: GeoJSON.Position | null;
		last: GeoJSON.Position | null;
	};
	popups: mapboxgl.Popup[];
	constructor(mapbox: mapboxgl.Map) {
		this.mapbox = mapbox;
		this.popups = [];
		this.liveLine = {
			first: null,
			last: null,
		};
	}

	addNewSource(data: GeoJSON.Feature | GeoJSON.FeatureCollection, id: string) {
		if (!this.mapbox.getSource(id)) {
			this.mapbox.addSource(id, {
				data: data,
				type: "geojson",
			});
		}
	}

	// adds the initial source
	setupSource(geojsonData: GeoJSON.FeatureCollection) {
		this.addNewSource(geojsonData, mapboxSourceId);
		this.addLayers();
	}

	// confirms that the source has been created and is loaded
	isSourceLoaded() {
		if (this.mapbox.getSource(mapboxSourceId) && this.mapbox.isSourceLoaded(mapboxSourceId)) return true;
		else return false;
	}

	// updates the data for the source
	setSourceData(geojsonData: GeoJSON.FeatureCollection) {
		const s = this.mapbox.getSource(mapboxSourceId) as mapboxgl.GeoJSONSource;
		s.setData(geojsonData);
		console.debug("Mapbox source updated with new data:", geojsonData);
	}

	// checks the source is loaded before updating data
	updateSource(geojsonData: GeoJSON.FeatureCollection) {
		const checkSourceUpdates = (e: mapboxgl.EventData) => {
			if (e.sourceId === mapboxSourceId && e.isSourceLoaded) {
				this.mapbox.off("sourcedata", checkSourceUpdates);
				this.setSourceData(geojsonData);
			}
		};
		if (this.isSourceLoaded()) this.setSourceData(geojsonData);
		else this.mapbox.on("sourcedata", checkSourceUpdates);
	}

	addLayers() {
		if (this.mapbox.getLayer(mapboxPointLayerId)) return;
		// add polygon layer
		this.mapbox.addLayer(
			{
				filter: ["==", ["geometry-type"], "Polygon"],
				id: mapboxPolygonLayerId,
				source: mapboxSourceId,
				type: "fill",
				paint: {
					"fill-color": ["case", ["!=", ["get", "color"], ""], ["get", "color"], "red"],
					"fill-opacity": 0.5,
				},
			},
			"land-structure-polygon"
		);
		// add polygon boundary layer
		this.mapbox.addLayer(
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
		this.mapbox.addLayer(
			{
				filter: ["==", ["geometry-type"], "Point"],
				id: mapboxPointLayerId,
				source: mapboxSourceId,
				type: "circle",
				paint: {
					"circle-color": ["case", ["!=", ["get", "color"], ""], ["get", "color"], "red"],
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
		this.mapbox.addLayer(
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
		this.triggerCursor();
	}

	defaultCursor = () => {
		this.mapbox.getCanvas().style.cursor = "default";
	};
	pointerCursor = () => {
		this.mapbox.getCanvas().style.cursor = "pointer";
	};

	// change cursor to pointer over features/triggers, and respond to clicks
	triggerCursor() {
		this.mapbox.on("mouseenter", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], this.pointerCursor);
		this.mapbox.on("mouseleave", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], this.defaultCursor);
		this.mapbox.on("click", [`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId], this.handleFeatureClick);
	}

	// arrow function required for desired context
	handleFeatureClick = (e: mapboxgl.EventData) => {
		// use center prop if available, or revert to click lngLat
		const center = e.features[0].properties.center ? JSON.parse(e.features[0].properties.center) : e.lngLat;
		this.goToFeature(center);
		this.showFeaturePopup(e.features[0].properties);
		// add handling for a click that captures multiple features
	};

	goToBounds(bounds: mapboxgl.LngLatBoundsLike) {
		this.mapbox.fitBounds(bounds, {
			duration: 1500,
			// easing: (t) => {
			// 	return t * t * t;
			// },
			padding: 100,
		});
	}

	goToFeature(lngLat: mapboxgl.LngLatLike) {
		this.mapbox.easeTo({
			center: lngLat,
			duration: 1000,
		});
	}

	showFeaturePopup(properties: mapboxgl.EventData) {
    if (!properties) return;
    console.log(properties);
    const popupHtml = MapboxPopup(properties as featureProperties);
    console.log(popupHtml);
    const container = document.createElement("div");
    
    
		this.clearAllPopups();
		const lngLat = typeof properties.center == "string" ? JSON.parse(properties.center) : properties.center;
		const popup = new mapboxgl.Popup({ anchor: "left" });
    popup.setLngLat(lngLat)
      .setHTML(`<h2 style="color:black;">${properties.name}</h2>`)
      // .setDOMContent()
      .setMaxWidth("300px")
      .addTo(this.mapbox);
		this.popups.push(popup);
	}

	goToWithPopup = (properties: mapboxgl.EventData) => {
		this.goToFeature(properties.center);
		this.showFeaturePopup(properties);
	};

	clearAllPopups() {
		if (this.popups.length) this.popups.forEach((popup) => popup.remove());
  }

	setupNewPolygonSource(polygonCoordinates: GeoJSON.Position[]) {
		const data = { ...newPolygonFeatureCollection };
		data.features.forEach((f) => {
			(f.geometry as any).coordinates = polygonCoordinates;
		});
		this.addNewSource(data, newPolygonSource);
		this.setupNewPolygonLayers();
	}

	updateNewPolygonSource(polygonCoordinates: GeoJSON.Position[]) {
		const s = this.mapbox.getSource(newPolygonSource) as mapboxgl.GeoJSONSource;
		if (!s) this.setupNewPolygonSource(polygonCoordinates);
		else {
			const data = { ...newPolygonFeatureCollection };
			data.features.forEach((f) => {
				(f.geometry as GeoJSON.LineString).coordinates = polygonCoordinates;
			});
			s.setData(data);
		}
	}

	setupNewPolygonLayers() {
		if (!this.mapbox.getSource(newPolygonSource)) return;
		if (!this.mapbox.getLayer(newPolygonLineLayer)) {
			this.mapbox.addLayer({
				id: newPolygonLineLayer,
				source: newPolygonSource,
				type: "line",
				paint: {
					"line-color": "red",
				},
			});
		}
		if (!this.mapbox.getLayer(newPolygonPointLayer)) {
			this.mapbox.addLayer({
				id: newPolygonPointLayer,
				source: newPolygonSource,
				type: "circle",
				paint: {
					"circle-color": "red",
				},
			});
		}
	}

	setupLivelineSource(polygonCoordinates: GeoJSON.Position[]) {
		// console.log("setupLiveLineSource fires");
		if (this.liveLine.first === null) this.updateLiveLineFixedPoints(polygonCoordinates);
		this.addNewSource(
			{
				type: "Feature",
				properties: {},
				geometry: {
					type: "LineString",
					coordinates: [this.liveLine.first!, this.liveLine.last ? this.liveLine.last : null!],
				},
			},
			liveLineSource
		);
		this.setupLivelineLayer();
	}

	setupLivelineLayer() {
		// console.log("setupLiveLineLayer fires");
		if (!this.mapbox.getSource(liveLineSource)) return;
		if (!this.mapbox.getLayer(liveLineLayer)) {
			this.mapbox.addLayer({
				id: liveLineLayer,
				source: liveLineSource,
				type: "line",
				paint: {
					"line-color": "orange",
				},
			});
		}
	}

  updateLivelineSource(e: mapboxgl.EventData) {
    if (!this.liveLine.first) return;
    const s = this.mapbox.getSource(liveLineSource) as mapboxgl.GeoJSONSource;
    if (!s) return;
    const coordinates = this.liveLine.last ? [this.liveLine.first, [e.lngLat.lng, e.lngLat.lat], this.liveLine.last] : [this.liveLine.first, [e.lngLat.lng, e.lngLat.lat]];
    s.setData({
			type: "Feature",
			properties: {},
			geometry: {
				type: "LineString",
				coordinates: coordinates,
			},
		});
	}

	resetLiveLineFixedPoints() {
		this.liveLine = {
			first: null,
			last: null,
		};
  }
  
  clearLiveLine() {
    // console.log("clearLiveLine fires");
		const s = this.mapbox.getSource(liveLineSource) as mapboxgl.GeoJSONSource;
		if (!s) return;
		s.setData({
			type: "Feature",
			properties: {},
			geometry: {
				type: "LineString",
				coordinates: [],
			},
    });
    this.resetLiveLineFixedPoints();
  }

	updateLiveLineFixedPoints(polygonCoordinates: GeoJSON.Position[]) {
		if (!polygonCoordinates.length) return;
		this.liveLine.first = polygonCoordinates[0];
		if (polygonCoordinates[0] !== polygonCoordinates[polygonCoordinates.length - 1]) {
			this.liveLine.last = polygonCoordinates[polygonCoordinates.length - 1];
    }
	}

	calculateLiveLineCoordinates(cursorLngLat: GeoJSON.Position | null, polygonCoordinates: GeoJSON.Position[]) {
		// console.log("calculateLiveLineCoordinates fires");
		const p = polygonCoordinates.slice(-1);
		// const lastPoint: GeoJSON.Position = [...p[0]];
		const coordinates: GeoJSON.Position[] = [p[0]];
		if (polygonCoordinates.length) coordinates.push(cursorLngLat as GeoJSON.Position);
		if (polygonCoordinates.length === 1) return coordinates;
		else if (polygonCoordinates.length > 1) {
			coordinates.push(polygonCoordinates[0] as GeoJSON.Position);
			return coordinates;
		} else {
			coordinates.push(p[0]);
			return coordinates;
		}
	}
}
