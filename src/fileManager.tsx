import { ChangeEvent } from "react";

export function saveCurrentData(geojsonData: GeoJSON.FeatureCollection) {
  const json = JSON.stringify(geojsonData);
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const link = document.createElement("a");
	link.href = url;
	link.download = "second-tradition.prxs";
	// document.body.appendChild(link);
	link.click();
	// Clean up resources
	URL.revokeObjectURL(url);
	// document.body.removeChild(link);
}

export const JsonToBlobDownloader: React.FC<{ data: object; fileName: string }> = ({ data, fileName }) => {
	const downloadJsonAsFile = () => {
		const json = JSON.stringify(data);
		const blob = new Blob([json], { type: "application/json" });
		const url = URL.createObjectURL(blob);

		const link = document.createElement("a");
		link.href = url;
		link.download = fileName;
		document.body.appendChild(link);
		link.click();

		// Clean up resources
		URL.revokeObjectURL(url);
		document.body.removeChild(link);
	};

	return <button onClick={downloadJsonAsFile}>Download JSON as {fileName}</button>;
};

export const JsonFileImporter: React.FC<{ onImport: (data: object) => void }> = ({ onImport }) => {
	const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = (event) => {
			if (!event.target?.result) return;
			try {
				const jsonData = JSON.parse(event.target.result as string);
				onImport(jsonData);
			} catch (error) {
				console.error("Error parsing JSON file:", error);
			}
		};
		reader.readAsText(file);
	};

	return <input type='file' accept='.prxs' onChange={handleFileChange} />;
};
