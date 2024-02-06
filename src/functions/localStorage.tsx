import { localStorageId } from "../variables";

function getLocalStorage() {
	// get item from localStorage,
	const item = localStorage.getItem(localStorageId);
	// it no item, reset storage to create empty feature collection item
	if (!item) resetLocalStorage();
	try {
		if (!item) return;
		const data: GeoJSON.FeatureCollection = JSON.parse(item);
		// if (data) setGeojsonData(data);
	} catch (error: any) {
		// Handle the error here
		console.error("Error loading data from localStorage:", error.message);
		if (
			window.confirm(
				"Error loading data from local storage. Would you like to reset the data?"
			)
		)
			resetLocalStorage();
	}
}

function setLocalStorage(geojsonData:GeoJSON.FeatureCollection) {
	// convert current data to a string and update localStorage
	try {
		const s = JSON.stringify(geojsonData);
		if (s) localStorage.setItem(localStorageId, s);
		// update mapbox data
      // if (map.current.loaded()) addDataToMap();
      // else map.current.on("load", addDataToMap);
		// catch and report any errors
	} catch (error: any) {
		console.error("Error updating localStorage:", error.message);
	}
}

function resetLocalStorage() {
  if (
		!window.confirm(
			"You are about to erase any saved data. Would you like to continue?"
		)
	)
		return;
	// check for an existing item and if present, remove it
	if (localStorage.getItem(localStorageId))
		localStorage.removeItem(localStorageId);
	// add an item with an empty feature collection
	const emptyFeatureCollection: GeoJSON.FeatureCollection = {
		type: "FeatureCollection",
		features: [],
	};
	localStorage.setItem(localStorageId, JSON.stringify(emptyFeatureCollection));
}
