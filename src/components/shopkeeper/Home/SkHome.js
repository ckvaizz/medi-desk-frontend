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
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
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
                
                <TableCell align="right">Added Date</TableCell>
                <TableCell align="right">Dose-Stock-Price</TableCell>
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
                  
                    <TableCell align="right">
                      {new Date(medi.regDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="right">
                      {medi.dose.map((i) =>`${i.dose}-${i.stock}-${i.price} ,` )}
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
        Add medicine
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
  const [dose,setDose]=React.useState([])
  React.useEffect(() => {
    setOpen(currentData.name !== "" ? true : false);
    setEdited({
      name: currentData?.name,
      companyName: currentData?.companyName,
      _id: currentData?._id,
    });
    setDose(currentData?.dose)
  }, [currentData]);

  const saveHandler = () => {
    setLoading(true);
    Axios.post("/medi/edit", {name:edited?.name,companyName:edited?.companyName,dose:dose,_id:edited?._id})
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
       
       {
         dose?.map((ds,key)=>{
           return(
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
                  label={`Dose`}
                  variant="outlined"
                  defaultValue={ds.dose}
                  onChange={(e) =>{
                  let newArr=[]
                  dose.map(i=>{
                    if(i.dose === ds.dose){
                      i.dose = e.target.value
                    }
                    newArr.push(i)
                   
                  })
                  setDose(newArr)
                  }}
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
                  id="sassi"
                  label={`Stock of dose- ${ds.dose}`}
                  variant="outlined"
                  defaultValue={ds.stock}
                  onChange={(e) => {
                    let newArr=[]
                  dose.map(i=>{
                    if(i.dose === ds.dose){
                      i.stock = e.target.value
                    }
                    newArr.push(i)
                    
                  })
                  setDose(newArr)
                  }}
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
                  id="sassi"
                  label={`Price of dose- ${ds.doses}`}
                  variant="outlined"
                  defaultValue={ds.price}
                  onChange={(e) => {
                    let newArr=[]
                    dose.map(i=>{
                      if(i.dose === ds.dose){
                        i.price = e.target.value
                      }
                      newArr.push(i)
                      
                    })
                    setDose(newArr)
                  }}
                />
              </Box>
            </div>
          </ListItem>
           )
         })
       }
       
       
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
  });
  const [doseObj, setDoseObj] = React.useState([]);
  const [doses, setDoses] = React.useState();
  const [loading, setLoading] = React.useState(false);
  const [temp, setTemp] = React.useState("");
  const [temp2, setTemp2] = React.useState("");
  const [err,setErr]=React.useState(false)

  const addHandler = () => {
    if(!edited.name || !edited.companyName || doses)return setErr(true)

    setLoading(true);
    Axios.post("/medi/add", {name:edited?.name,companyName:edited?.companyName,dose:doseObj})
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
                onChange={(e) =>{
                  setErr(false)
                  setEdited({ ...edited, name: e.target.value })}}
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
                onChange={(e) =>{
                  setErr(false)
                  setEdited({ ...edited, companyName: e.target.value })
                }
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
                value={doses}
                onChange={(e) => {
                  setErr(false)
                  setDoses(e.target.value);
                }}
              />
            </Box>
          </div>
        </ListItem>
        {doses && (
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
                  label={`stock of dose- ${doses}`}
                  variant="outlined"
                  onChange={(e) =>{
                    setErr(false)
                    setTemp(e.target.value)}}
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
                  id="sassi"
                  label={`Price of dose- ${doses}`}
                  variant="outlined"
                  onChange={(e) => {
                    setErr(false)
                    setTemp2(e.target.value);
                  }}
                />
              </Box>

              <button
              className="adddose-Btn"
                onClick={() => {
                  setErr(false)
                  if (temp && temp2) {
                    setDoseObj([
                      ...doseObj,
                      { dose: doses, stock: temp, price: temp2 },
                    ]);
                    setDoses('')
                    setTemp('')
                    setTemp2('')
                  } else errorToast("missing feild");
                }}
              >
                Add dose
              </button>
            </div>
          </ListItem>
        )}
        {
          doseObj.map(ds=>{
            return(
              <ListItem>
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-evenly",
              }}
            >
            # {ds.dose} - {ds.stock} -{ds.price}. ADDED
            </div>
          </ListItem>
            )
          })
        }
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
                ) : err?"Missing field":"Add"
                }
              </button>
            
          </div>
        </ListItem>
      </Dialog>
    </div>
  );
}
