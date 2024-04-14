import { createContext, useContext, useReducer } from "react";
import { bbox, centerOfMass } from "@turf/turf";
import { v4 as uuid } from "uuid";
import { getLocalStorage } from "../modules/localStorage";
import { emptyFeatureCollection, featureProperties } from "../variables";

interface actionType {
  coordinates?: number[] | number[][],
	properties?: featureProperties;
	type: string;
	uuid?: string;
	// other properties as needed
}

export const GeojsonContext = createContext(emptyFeatureCollection);
export const GeojsonDispatchContext = createContext<(a: actionType) => void>(null!);

const localData = getLocalStorage();
const initialData: GeoJSON.FeatureCollection = localData ? localData : emptyFeatureCollection;

export function GeojsonProvider({ children }: { children: React.ReactNode[] }) {
	const [geojsonData, dispatch] = useReducer(geojsonReducer, initialData);

	return (
		<GeojsonContext.Provider value={geojsonData}>
			<GeojsonDispatchContext.Provider value={dispatch}>{children}</GeojsonDispatchContext.Provider>
		</GeojsonContext.Provider>
	);
}

export function useGeojson() {
	return useContext(GeojsonContext);
}

export function useGeojsonDispatch() {
	return useContext(GeojsonDispatchContext);
}

function geojsonReducer(geojsonData: GeoJSON.FeatureCollection, action: actionType) {
  switch (action.type) {
    case "resetData": {
      return emptyFeatureCollection
    }
    // requires geojson feature properties and coordinates
    case "addedPoint": {
			// build new feature object
			const newFeature: GeoJSON.Feature = {
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: action.coordinates as number[],
				},
				properties: {
					...action.properties,
					center: action.coordinates,
					created: Date.now(),
					id: uuid(),
				},
			};
			// rebuild data with new feature
			const newData = { ...geojsonData };
			newData.features.push(newFeature);
			return newData;
		}
    // requires geojson feature properties and coordinates
		case "addedPolygon": {
			// build new feature object
			const newFeature: GeoJSON.Feature = {
				type: "Feature",
				geometry: {
					type: "Polygon",
					coordinates: [action.coordinates as number[][]],
				},
				properties: {
					...action.properties,
					created: Date.now(),
					id: uuid(),
				},
			};
			// add center and bbox coordinates
			const center = centerOfMass(newFeature.geometry);
			newFeature.properties!.bbox = bbox(newFeature.geometry);
			newFeature.properties!.center = center.geometry.coordinates;
			// rebuild data with new feature
			const newData = { ...geojsonData };
			newData.features.push(newFeature);
			return newData;
		}
    // requires geojson feature properties
    case "changed": {
			const updatedData = { ...geojsonData };
			updatedData.features = geojsonData.features.map((f) => {
				if (f.properties!.id !== action.properties!.id) return f;
				else {
					const updatedFeature = { ...f };
					updatedFeature.properties = { ...action.properties };
					return updatedFeature;
				}
			});
			return updatedData;
		}
    // requires geojson feature uuid
    case "deleted": {
      // why does the confirm appear twice? something to do with strict mode?
      if (!window.confirm("Are you sure you want to delete this feature?")) return geojsonData;
			const newData = {
				...geojsonData,
				features: geojsonData.features.filter((f) => f.properties!.id !== action.uuid),
			};
			return newData;
		}
		default: {
			throw Error("Unknown action: " + action.type);
		}
	}
}

/*

Within components:

const dispatch = useTasksDispatch();
...
<input
  placeholder="Add task"
  value={text}
  onChange={e => setText(e.target.value)}
/>
<button onClick={() => {
  setText('');
  dispatch({
    type: 'added',
    id: nextId++,
    text: text,
  }); 
}}>Add</button>

*/