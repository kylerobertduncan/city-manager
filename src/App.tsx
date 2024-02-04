import './App.css';
import Grid from '@mui/material/Grid';
import MapWindow from './components/MapWindow';
import Sidebar from './components/Sidebar';

function App() {

  return (
    <Grid container className="App">
      <MapWindow />
      <Sidebar />
    </Grid>
  );
}

export default App;
