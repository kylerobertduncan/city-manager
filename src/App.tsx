import './App.css';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Mapbox from './Mapbox';

function App() {

  return (
    <Grid container className="App">
        <Mapbox />
      <Grid item component="aside" xs={12} lg={3}>
        <Container>
          <Typography component="h1" variant="h3">
            City Manager
          </Typography>
        </Container>
      </Grid>
    </Grid>
  );
}

export default App;
