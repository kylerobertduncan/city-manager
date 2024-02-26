import mapboxgl from "mapbox-gl";
import {
	// localStorageId,
	mapboxPointLayerId,
	mapboxPolygonLayerId,
	mapboxSourceId,
	// emptyFeatureCollection,
	// newPolygonSource,
	// newPolygonPointLayer,
	// newPolygonLineLayer,
	// liveLineSource,
	// liveLineLayer,
} from "./variables";

export default class mapHandler {
	map: mapboxgl.Map | null;

	constructor(
		// public mapRef: any,
		public mapContainer: any,
		public mapCenter: { lng: number; lat: number },
		public setMapCenter: (lngLat: { lng: number; lat: number }) => void,
		public zoom: number,
		public setZoom: (z: number) => void
	) {
		this.map = null;
		// this.mapRef = mapRef;
		this.mapContainer = mapContainer;
		this.mapCenter = mapCenter;
		this.zoom = zoom;
		this.setMapCenter = setMapCenter;
		this.setZoom = setZoom;
	}

	/* Map intialization and core data setup */

	init() {
		this.map = new mapboxgl.Map({
			container: "map-container",
			style: "mapbox://styles/mapbox/dark-v10",
			center: this.mapCenter,
			zoom: this.zoom,
		});
		this.map.on("move", () => {
			this.setMapCenter(this.map!.getCenter());
			this.setZoom(this.map!.getZoom());
		});
	}

	addCoreSource(geojsonData: GeoJSON.FeatureCollection) {
		if (this.map!.getSource(mapboxSourceId)) return;
		// add source
		this.map!.addSource(mapboxSourceId, {
			type: "geojson",
			data: geojsonData,
		});
	}

	addCoreLayers() {
		if (this.map!.getLayer(mapboxPointLayerId)) return;
		this.map!.addLayer(
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
		// add layer
		this.map!.addLayer(
			{
				filter: ["==", ["geometry-type"], "Point"],
				id: mapboxPointLayerId,
				source: mapboxSourceId,
				type: "circle",
				paint: {
					"circle-color": "red",
					"circle-opacity": 0.75,
					"circle-radius": 10,
				},
			},
			"road-label"
		);
		this.map!.addLayer(
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
		this.map!.on(
			"mouseenter",
			[`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId],
			() => (this.map!.getCanvas().style.cursor = "pointer")
		);
		this.map!.on(
			"mouseleave",
			[`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId],
			() => (this.map!.getCanvas().style.cursor = "")
		);
		this.map!.on(
			"click",
			[`${mapboxPointLayerId}-trigger`, mapboxPolygonLayerId],
			this.handleFeatureClick
		);
	}

	updateCoreData(geojsonData: GeoJSON.FeatureCollection) {
		// mapbox update triggered
		if (
			this.map!.getSource(mapboxSourceId) &&
			this.map!.isSourceLoaded(mapboxSourceId)
		)
			this.mapboxSetCoreData(geojsonData);
		// Fired when one of the map's sources loads or changes
		else
			this.map!.on("sourcedata", (e) =>
				this.handleCoreSourceData(e, geojsonData)
			);
	}

	// listens for our mapbox source to load then updates data
	handleCoreSourceData(
		e: mapboxgl.EventData,
		geojsonData: GeoJSON.FeatureCollection
	) {
		if (e.sourceId === mapboxSourceId && e.isSourceLoaded) {
			this.map!.off("sourcedata", (e) =>
				this.handleCoreSourceData(e, geojsonData)
			);
			this.mapboxSetCoreData(geojsonData);
		}
	}

	mapboxSetCoreData(geojsonData: GeoJSON.FeatureCollection) {
		const s = this.map!.getSource(mapboxSourceId) as mapboxgl.GeoJSONSource;
		s.setData(geojsonData);
	}

	/* Utility Functions */

	goToFeature(lngLat: mapboxgl.LngLatLike) {
		this.map!.easeTo({
			center: lngLat,
			duration: 1000,
		});
	}

	showFeaturePopup(properties: mapboxgl.EventData) {
		if (!properties) return;
		// close other popups? multiple can be opened from sidebar
		const lngLat =
			typeof properties.center == "string"
				? JSON.parse(properties.center)
				: properties.center;
		const popup = new mapboxgl.Popup({ anchor: "left" });
		popup
			.setLngLat(lngLat)
			.setHTML(`<h2 style="color:black;">${properties.name}</h2>`)
			.setMaxWidth("300px")
			.addTo(this.map!);
	}

	handleFeatureClick(e: mapboxgl.EventData) {
		// handle click that captures multiple features
		const center = e.features[0].properties.center
			? JSON.parse(e.features[0].properties.center)
			: e.lngLat;
		this.goToFeature(center);
		this.showFeaturePopup(e.features[0].properties);
	}
}
