import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import SidebarHeader from './SidebarHeader';
// import Typography from '@mui/material/Typography';

/*
On load, check localStorage for any existing features
If present, add them to the sidebar
*/

export default function Sidebar() {
  return(
    <Grid item component="aside" xs={12} lg={3}>
      <SidebarHeader />
      <Container>
        
      </Container>
    </Grid>
  )
}