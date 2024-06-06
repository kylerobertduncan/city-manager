import { localStorageId, prxsFile } from "../variables";

export function getLocalStorage() {
	// get item from localStorage
	const item = localStorage.getItem(localStorageId);
	// it no item, reset storage to create empty feature collection item
	// if (!item) clearAllData();
	// What if localStorage is lost (cache cleared) but data is still present in state? Worth preserving state?
	try {
		if (!item) throw new Error("No data found");
		const data: prxsFile = JSON.parse(item);
    if (data) return data;
  } catch (error: any) {
    console.error("Error retrieving local storage data:", error.message);
  };
}

export function setLocalStorage(geojsonData:prxsFile) {
	// convert current data to a string and update localStorage
	try {
		const s = JSON.stringify(geojsonData);
    if (s) localStorage.setItem(localStorageId, s);
    console.debug("Local Storage updated with new data:", geojsonData);
	} catch (error: any) {
		console.error("Error updating local storage data:", error.message);
	}
}
