import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./theme";
// local components & routes
import App from "./App";
import ErrorPage from "./routes/Error";
import Root from "./routes/Root";
// import SharedMap, { shareLoader } from "./routes/SharedMap";
import SharedMap, { shareLoader } from "./routes/NewSharedMap";
// reporting (delete?)
import reportWebVitals from "./reportWebVitals";

const router = createBrowserRouter([
	{
		path: "/oldApp",
		element: <App />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/",
		element: <Root />,
		errorElement: <ErrorPage />,
	},
	{
		path: "/share/:sharingID",
		element: <SharedMap />,
		errorElement: <ErrorPage />,
		loader: shareLoader,
	},
]);

const root = ReactDOM.createRoot(
	document.getElementById("root") as HTMLElement
);
root.render(
	<React.StrictMode>
    <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router}/>
		</ThemeProvider>
	</React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
