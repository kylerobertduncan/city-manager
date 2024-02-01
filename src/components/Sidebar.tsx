import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export default function Sidebar() {
  return(
    <Grid item component="aside" xs={12} lg={3}>
      <Container>
        <Typography component="h1" variant="h3">
          City Manager
        </Typography>
      </Container>
    </Grid>
  )
}