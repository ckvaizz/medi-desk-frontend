import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import "./skHome.css";
import Axios from "../../../constants/Axios";
import { errorToast, infoToast, successToast } from "../../../constants/toast";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import EditIcon from "@mui/icons-material/Edit";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";
import Button from "@mui/material/Button";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Dialog from "@mui/material/Dialog";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import AddCircleIcon from "@mui/icons-material/AddCircle";

export default function SkHome() {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [openAdd, setOpenAdd] = React.useState(false);
  const [currentData, setCurrentData] = React.useState({
    name: "",
    companyName: "",
    dose: [],
    stock: "",
    price: "",
    _id: "",
  });

  React.useEffect(() => {
    setLoading(true);
    Axios.get("/medi/get-sks")
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          setData(res.data.medis);
        } else errorToast(res.data.message || "something wrong");
      })
      .catch((e) => {
        setLoading(false);
        // errorToast("something wrong");
      });
  }, []);

  const deleteHandler = (_id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      preConfirm: () => {
        return Axios.post("/medi/delete", { _id })
          .then((res) => {
            if (!res.data.status) throw new Error();
            return;
          })
          .catch((e) => {
            Swal.showValidationMessage(`Request failed`);
          });
      },
      allowOutsideClick: () => !Swal.isLoading(),
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Deleted!", "medicine", "success");
        setData(data.filter((e) => e._id !== _id));
      }
    });
  };

  return (
    <div className="sk-home-main">
      <div className="sk-main-table">
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>Medicine Name</TableCell>
                <TableCell align="right">Company name</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell align="right">Added Date</TableCell>
                <TableCell align="right">Dose</TableCell>
                <TableCell align="right">Options</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length !== 0 &&
                !loading &&
                data.map((medi) => (
                  <TableRow
                    key={medi.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {medi.name}
                    </TableCell>
                    <TableCell align="right">{medi.companyName}</TableCell>
                    <TableCell align="right">{medi.stock}</TableCell>
                    <TableCell align="right">
                      {new Date(medi.regDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {medi.dose.map((i) => `${i},`)}
                    </TableCell>
                    <TableCell align="right">
                      <button
                        className="edit-btn"
                        onClick={async () => {
                          console.log(medi);
                          await setCurrentData({
                            name: medi.name,
                            companyName: medi.companyName,
                            dose: medi.dose,
                            price: medi.price,
                            stock: medi.stock,
                            _id: medi._id,
                          });
                        }}
                      >
                        <EditIcon />
                      </button>{" "}
                      <button
                        className="delete-btn"
                        onClick={() => deleteHandler(medi._id)}
                      >
                        <DeleteForeverIcon />
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              {loading && (
                <TableRow
                  key={"nothing"}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  {" "}
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                  </Box>
                </TableRow>
              )}
              {data.length === 0 && !loading && (
                <TableRow>
                  {" "}
                  <TableCell align="right">No medicines found</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="addMedi-btn" onClick={() => setOpenAdd(true)}>
        <AddCircleIcon />
      </div>
      <EditScreenDialog currentData={currentData} />
      <AddScreenDialog setOpenAdd={setOpenAdd} openAdd={openAdd} />
    </div>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function EditScreenDialog({ currentData }) {
  const handleClose = () => {
    setOpen(false);
  };
  const [edited, setEdited] = React.useState({});
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    setOpen(currentData.name !== "" ? true : false);
    setEdited({
      name: currentData?.name,
      companyName: currentData?.companyName,
      dose: currentData?.dose,
      stock: currentData?.stock,
      price: currentData?.price,
      _id: currentData?._id,
    });
  }, [currentData]);

  const saveHandler = () => {
    setLoading(true);
    Axios.post("/medi/edit", edited)
      .then((res) => {
        handleClose();
        setLoading(false);
        if (res.data.status) {
          successToast("edited successfully", 4000, () =>
            window.location.reload()
          );
        } else {
          infoToast(res.data.message || "Failed to update");
        }
      })
      .catch((e) => {
        handleClose();
        setLoading(false);
        errorToast("something wrong..");
      });
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Edit
            </Typography>
          </Toolbar>
        </AppBar>

        <ListItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Name"
                defaultValue={edited.name}
                variant="outlined"
                onChange={(e) => setEdited({ ...edited, name: e.target.value })}
              />
            </Box>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Company name"
                defaultValue={edited.companyName}
                variant="outlined"
                onChange={(e) =>
                  setEdited({ ...edited, companyName: e.target.value })
                }
              />
            </Box>
          </div>
        </ListItem>
        <ListItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Stock"
                defaultValue={edited.stock}
                variant="outlined"
                onChange={(e) =>
                  setEdited({ ...edited, stock: e.target.value })
                }
              />
            </Box>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Price"
                defaultValue={edited.price}
                variant="outlined"
                onChange={(e) =>
                  setEdited({ ...edited, price: e.target.value })
                }
              />
            </Box>
          </div>
        </ListItem>
        <ListItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Dose"
                defaultValue={edited?.dose?.map((i) => `${i}`)}
                variant="outlined"
                onChange={(e) =>
                  setEdited({ ...edited, dose: e.target.value.split(",") })
                }
              />
            </Box>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <button className="save-btn" onClick={saveHandler}>
              {loading ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              ) : (
                "Save"
              )}
            </button>
          </div>
        </ListItem>
      </Dialog>
    </div>
  );
}

function AddScreenDialog({ setOpenAdd, openAdd }) {
  const handleClose = () => {
    setOpenAdd(false);
  };
  const [edited, setEdited] = React.useState({
    name: "",
    companyName: "",
    dose: "",
    stock: "",
    price: "",
  });

  const [loading, setLoading] = React.useState(false);

  const addHandler = () => {
    setLoading(true);
    Axios.post("/medi/add", edited)
      .then((res) => {
        handleClose();
        setLoading(false);
        if (res.data.status) {
          successToast("Added successfully", 4000, () =>
            window.location.reload()
          );
        } else {
          infoToast(res.data.message || "Failed to add");
        }
      })
      .catch((e) => {
        handleClose();
        setLoading(false);
        errorToast("something wrong..");
      });
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={openAdd}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Add Medicine
            </Typography>
          </Toolbar>
        </AppBar>

        <ListItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Name"
                variant="outlined"
                onChange={(e) => setEdited({ ...edited, name: e.target.value })}
              />
            </Box>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Company name"
                variant="outlined"
                onChange={(e) =>
                  setEdited({ ...edited, companyName: e.target.value })
                }
              />
            </Box>
          </div>
        </ListItem>
        <ListItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Stock"
                variant="outlined"
                onChange={(e) =>
                  setEdited({ ...edited, stock: e.target.value })
                }
              />
            </Box>
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Price"
                variant="outlined"
                onChange={(e) =>
                  setEdited({ ...edited, price: e.target.value })
                }
              />
            </Box>
          </div>
        </ListItem>
        <ListItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <Box
              component="form"
              sx={{
                "& > :not(style)": { m: 1, width: "50ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                id="outlined-basic"
                label="Dose"
                variant="outlined"
                onChange={(e) =>
                  setEdited({ ...edited, dose: e.target.value.split(",") })
                }
              />
            </Box>
          </div>
        </ListItem>
        <Divider />
        <ListItem>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            <button className="save-btn" onClick={addHandler}>
              {loading ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              ) : (
                "Add"
              )}
            </button>
          </div>
        </ListItem>
      </Dialog>
    </div>
  );
}
