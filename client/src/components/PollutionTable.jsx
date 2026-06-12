// src/components/PollutionTable.jsx
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Typography, Chip,
} from "@mui/material";

function PollutionTable({ data }) {
  if (!data || !data.payload || !data.payload.components) return null;

  const { components } = data.payload;

  return (
    <TableContainer component={Paper} sx={{ mt: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        Pollutant Levels in {data.city}
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><strong>Pollutant</strong></TableCell>
            <TableCell align="right"><strong>Concentration (μg/m³)</strong></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.entries(components).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell>
                <Chip label={key.toUpperCase()} color="info" />
              </TableCell>
              <TableCell align="right">{value.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PollutionTable;
