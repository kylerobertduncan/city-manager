import './App.css';
import Grid from '@mui/material/Grid';
import Mapbox from './components/Mapbox';
import Sidebar from './components/Sidebar';

function App() {

  return (
    <Grid container className="App">
      <Mapbox />
      <Sidebar />
    </Grid>
  );
}

export default App;
