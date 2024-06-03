import { Box, Container, Typography } from "@mui/material";
import { featureProperties } from "../variables";

export default function MapboxPopup(properties:featureProperties) {
  return (
    <Box>
      <Container>
        <Typography>
          {properties.name}
        </Typography>
      </Container>
    </Box>
  )
}