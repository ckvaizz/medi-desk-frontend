import "./medicineList.css";
import * as React from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import Axios from "../../../constants/Axios";
import { infoToast } from "../../../constants/toast";

export default function MedicineList() {
  const { medi } = useParams();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setLoading(true);
    Axios.post("/medi/all-name", { data: medi })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          setData(res.data.medis);
        } else {
          infoToast("something wrong please try again");
        }
      })
      .catch((e) => {
        setLoading(false);
        infoToast("something wrong please try again");
      });
  }, []);

  return (
    <div className="mediList-main">
      <div className="medi-cards">
        {!loading &&
          data.length !== 0 &&
          data.map((item, key) => {
            return (
              <CardDesign
                mediName={item.name}
                companyName={item.companyName}
                shopName={item.shopName}
                dose={item.dose}
                price={item.price}
                stock={item.stock}
                item={item}
                key={key}
              />
            );
          })}
      </div>
    </div>
  );
}

function CardDesign({ shopName, mediName, companyName, stock, dose, price }) {
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
          {dose.map((i) => `${i},`)}
          <br />
          {`stock - ${stock} , price - ${price}`}
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
