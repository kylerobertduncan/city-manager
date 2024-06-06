import { ChangeEvent } from "react";
import { styled } from "@mui/material/styles";
import { prxsFile } from "./variables";

const VisuallyHiddenInput = styled("input")({
	clip: "rect(0 0 0 0)",
	clipPath: "inset(50%)",
	height: 1,
	overflow: "hidden",
	position: "absolute",
	bottom: 0,
	left: 0,
	whiteSpace: "nowrap",
	width: 1,
});

export function saveCurrentData(geojsonData: prxsFile) {
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

export function LoadNewData({ onImport }: { onImport: (newData:prxsFile) => void }) {
  const handleNewFile = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      try {
        const jsonData = JSON.parse(e.target.result as string);
        onImport(jsonData);
      } catch (error) {
        console.error("Error parsing JSON file:", error);
      }
    };
    reader.readAsText(file);
  };
  return <VisuallyHiddenInput type="file" accept=".prxs" onChange={handleNewFile}/>
}
