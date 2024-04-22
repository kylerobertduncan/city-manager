import { createContext, useContext, useReducer } from "react";
import { bbox, centerOfMass } from "@turf/turf";
import { getLocalStorage } from "../modules/localStorage";
import { emptyFeatureCollection, featureProperties } from "../variables";

interface actionType {
  geometry?: GeoJSON.Point | GeoJSON.Polygon,
	properties?: featureProperties;
	type: string;
	uuid?: string;
	// other properties as needed
}

const GeojsonContext = createContext(emptyFeatureCollection);
const GeojsonDispatchContext = createContext<(a: actionType) => void>(null!);

const localData = getLocalStorage();
const initialData: GeoJSON.FeatureCollection = localData ? localData : emptyFeatureCollection;

function createInitialData() {
  const localData = getLocalStorage();
  if (localData) return localData;
  else return emptyFeatureCollection;
}

export function GeojsonProvider({ children }: { children: React.ReactNode }) {
	const [geojsonData, dispatch] = useReducer(geojsonReducer, initialData, createInitialData);
	return (
		<GeojsonContext.Provider value={geojsonData}>
      <GeojsonDispatchContext.Provider value={dispatch}>
        {children}
      </GeojsonDispatchContext.Provider>
		</GeojsonContext.Provider>
	);
}

export function useGeojson() {
	return useContext(GeojsonContext);
}

export function useGeojsonDispatch() {
	return useContext(GeojsonDispatchContext);
}

function getCenter(geometry: GeoJSON.Geometry) {
  if (geometry.type === "Point") return geometry.coordinates;
  if (geometry.type === "Polygon") {
    centerOfMass(geometry);
  } 
}

function geojsonReducer(geojsonData: GeoJSON.FeatureCollection, action: actionType) {
  switch (action.type) {
    case "resetData": {
      return emptyFeatureCollection
    }
    case "addFeature": {
      if (!action.geometry) throw Error("Invalid geometry: " + action);
      // check if uuid already exists, avoid duplicates
			const newFeature: GeoJSON.Feature = {
				type: "Feature",
				geometry: action.geometry,
				properties: {
					...action.properties,
					center: getCenter(action.geometry),
				},
      };
      if (action.geometry.type === "Polygon") {
        newFeature.properties!.bbox = bbox(newFeature.geometry);
      }
			// rebuild data with new feature
			const newData:GeoJSON.FeatureCollection = { ...geojsonData };
      newData.features.push(newFeature);
      // firing twice here for some reason?
      console.log("feature added in reducer");
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
      // all dispatches seem to be firing twice?
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
