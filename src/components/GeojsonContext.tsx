import { createContext, useContext, useReducer } from "react";
import { emptyFeatureCollection } from "../variables";

export const GeojsonContext = createContext(emptyFeatureCollection);
export const GeojsonDispatchContext = createContext<any>(null); // create an interface for dispatch?

const initialData: GeoJSON.FeatureCollection = emptyFeatureCollection;

interface actionType {
  type: string,
  uuid?: string,
  // other properties as needed
}

export function GeojsonProvider({ children }:{ children:React.ReactNode[]}) {
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

function geojsonReducer(geojsonData:GeoJSON.FeatureCollection, action:actionType) {
	switch (action.type) {
		case "added": {
			// return [
			// 	...geojsonData,
			// 	{
			// 		id: action.id,
			// 		text: action.text,
			// 		done: false,
			// 	},
      // ];
      return geojsonData; // placeholder
		}
		case "changed": {
			// return geojsonData.map((t) => {
			// 	if (t.id === action.task.id) {
			// 		return action.task;
			// 	} else {
			// 		return t;
			// 	}
      // });
      return geojsonData; // placeholder
		}
		case "deleted": {
      // return geojsonData.filter((t) => t.id !== action.id);
      return geojsonData; // placeholder
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