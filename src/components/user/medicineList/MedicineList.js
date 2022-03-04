import "./medicineList.css";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

export default function MedicineList() {
  return (
    <div className="mediList-main">
      <div className="medi-cards">
        <CardDesign mediName={"paracitamol"} companyName={"company name"}  shopName={"heyy"} />
        
      </div>
    </div>
  );
}



function CardDesign({shopName,mediName,companyName}) {
    const card = (
        <React.Fragment>
          <CardContent>
            <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
             {shopName}
            </Typography>
            <Typography variant="h5" component="div">
              {mediName}
            </Typography>
            <Typography sx={{ mb: 1.5 }} color="text.secondary">
             {companyName}
            </Typography>
            <Typography variant="body2">
              well meaning and kindly.
              <br />
              {'"a benevolent smile"'}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Book time</Button>
          </CardActions>
        </React.Fragment>
      );

  return (
    <Box sx={{ width: 275, margin: 2 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}
