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
import { infoToast, successToast } from "../../../constants/toast";
import Skeleton from "@mui/material/Skeleton";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";

import TextField from "@mui/material/TextField";

import LinearProgress from "@mui/material/LinearProgress";

export default function MedicineList() {
  const { medi } = useParams();
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [open, setOpen] = React.useState(false);
  const [currentData, setCurrentdata] = React.useState({});
  const [user, setuser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );
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
        // infoToast("something wrong please try again");
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
                shopNumber={item.shopNumber}
                shopLandmark={item?.shopLandmark}
                item={item}
                key={key}
                status={true}
                setOpen={setOpen}
                setCurrentdata={setCurrentdata}
              />
            );
          })}
        {loading &&
          Array.from(new Array(10)).map((item) => {
            return (
              <>
                <Box sx={{ pt: 0.5, margin: 2 }}>
                  <Skeleton variant="rectangular" width={210} height={118} />
                  <Skeleton />
                  <Skeleton width="60%" />
                </Box>
              </>
            );
          })}
        {data.length == 0 && !loading && (
          <CardDesign
            mediName={""}
            companyName={"No items found"}
            shopName={""}
            dose={[]}
            item={""}
            status={false}
          />
        )}
      </div>
      {currentData && (
        <MaxWidthDialog
          open={open}
          setOpen={setOpen}
          currentData={currentData}
          userName={user?.user?.name}
        />
      )}
    </div>
  );
}

function CardDesign({
  shopName,
  mediName,
  companyName,
  shopNumber,
  dose,
  shopLandmark,
  status,
  setOpen,
  setCurrentdata,
  item,
}) {
  const card = (
    <React.Fragment>
      <CardContent>
        <Typography sx={{ fontSize: 20 }} color="text.primary" gutterBottom>
          Shop :- {shopName} <br />
          {shopNumber}
        </Typography>
        <Typography sx={{ fontSize: 13 }} variant="h6" component="div">
          Landmark :- {shopLandmark}
        </Typography>
        <Typography variant="h5" component="div">
          {mediName}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {companyName}
        </Typography>
        <Typography variant="body2">
          {dose.length !== 0 &&
            dose?.map((i) => {
              return (
                <>
                  Dose - {i.dose} ,Stock - {i.stock} ,Price - {i.price} ₹<br />
                </>
              );
            })}
          <br />
        </Typography>
      </CardContent>
      <CardActions>
        {status && (
          <Button
            size="small"
            onClick={() => {
              if (20 - new Date().getHours() < 1) {
                return infoToast("Time over ...");
              }
              setCurrentdata({
                _id: item._id,
                mediName,
                companyName,
                dose,
                shopId: item.shopId,
              });
              setOpen(true);
            }}
          >
            Book time
          </Button>
        )}
      </CardActions>
    </React.Fragment>
  );

  return (
    <Box sx={{ width: 275, margin: 2 }}>
      <Card variant="outlined">{card}</Card>
    </Box>
  );
}

function MaxWidthDialog({ open, setOpen, currentData, userName }) {
  const [dose, setDose] = React.useState({
    dose: "",
    quandity: "",
  });
  const [time, setTime] = React.useState("");
  const [slotStatus, setSlotStatus] = React.useState({});
  const [arr, _] = React.useState([9, 10, 11, 12, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [currentTime, q] = React.useState(new Date().getHours());
  const [loading, setLoading] = React.useState(false);
  const [bal, setBal] = React.useState("");
  const [Error, setError] = React.useState(false);
  React.useEffect(() => {
    setLoading(true);
    Axios.post("/medi/get-slot", { shopId: currentData.shopId })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          setSlotStatus(res.data.slotStatus);
        } else {
          infoToast(res.data.message || "something wrong");
          setOpen(false);
        }
      })
      .catch((e) => {
        setLoading(false);

        setOpen(false);
      });
    return () => {
      setTime("");
    };
  }, []);

  const handleClose = () => {
    setDose({
      dose: "",
      quandity: "",
    });
    setError(false);
    setBal("");
    setTime("");
    setOpen(false);
  };
  const timeHandler = (time) => {
    setTime(time);
  };

  const bookHandler = () => {
    if (Error) return;
    if (dose.dose === "" || dose.quandity == "" || !time)
      return infoToast("choose Time and Dose");
    setLoading(true);
    Axios.post("/medi/book-slot", {
      time,
      shopId: currentData.shopId,
      _id: currentData._id,
      bal,
      name: userName,
      cart: {
        name: currentData.mediName,
        companyName: currentData.companyName,
        dose,
      },
    })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          setOpen(false);
          successToast("slot booked", 4000, () => {});
        } else {
          setOpen(false);
          infoToast(res.data.message || "something wrong");
        }
      })
      .catch((e) => {
        setLoading(false);
        setOpen(false);
        infoToast("something wrong");
      });
  };

  return (
    <React.Fragment>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Select Dose and Time</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {arr.map((i) => {
              return (
                <Button
                  onClick={() =>
                    timeHandler((i < 9 ? i + 12 : i) - currentTime < 1 ? "" : i)
                  }
                  style={{
                    backgroundColor:
                      slotStatus[i] === 10
                        ? "red"
                        : (i < 9 ? i + 12 : i) - currentTime < 1
                        ? "red"
                        : "green",
                    color: "white",
                    opacity: time == i && 0.7,
                    marginLeft: "5px",
                  }}
                >
                  {i}
                </Button>
              );
            })}
          </DialogContentText>
          <Box
            noValidate
            component="form"
            sx={{
              display: "flex",
              flexDirection: "column",
              m: "auto",
              width: "fit-content",
            }}
          >
            <FormControl sx={{ mt: 2, minWidth: 120 }}>
              <InputLabel htmlFor="max-width">Dose</InputLabel>
              <Select
                onChange={(e) => {
                  setError(false);
                  setDose({ ...dose, dose: e.target.value });
                }}
                label="Dose"
                inputProps={{
                  name: "dose",
                  id: "max-width",
                }}
              >
                {currentData?.dose?.map((i) => (
                  <MenuItem value={i.dose}>{i.dose}</MenuItem>
                ))}
              </Select>
              {dose?.dose !== "" && (
                <Box
                  component="form"
                  sx={{
                    "& > :not(style)": { m: 1, width: "50ch" },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    label={`Quandity max-${
                      currentData?.dose?.filter((i) => i.dose === dose?.dose)[0]
                        .stock
                    }`}
                    variant="outlined"
                    type="Number"
                    onChange={(e) => {
                      if (
                        e.target.value >
                          currentData?.dose?.filter(
                            (i) => i.dose === dose?.dose
                          )[0].stock ||
                        currentData?.dose?.filter(
                          (i) => i.dose === dose?.dose
                        )[0].stock == 0
                      ) {
                        setError(true);
                      } else {
                        setError(false);
                        setBal(
                          currentData?.dose?.filter(
                            (i) => i.dose === dose?.dose
                          )[0].stock - e.target.value
                        );
                        setDose({ ...dose, quandity: e.target.value });
                      }
                    }}
                  />
                  {dose.quandity !== "" && (
                    <h5>
                      Total price:-
                      {currentData?.dose?.filter(
                        (i) => i.dose === dose?.dose
                      )[0].price * dose.quandity}{" "}
                      ₹{" "}
                    </h5>
                  )}
                </Box>
              )}
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          {loading ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress />
            </Box>
          ) : (
            <>
              <Button onClick={handleClose}>Close</Button>
              <Button onClick={bookHandler}>
                {Error ? "out of stock" : "Book"}
              </Button>
            </>
          )}
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}
