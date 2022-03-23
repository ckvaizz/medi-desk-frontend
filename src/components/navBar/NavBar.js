import "./navBar.css";
import * as React from "react";
import Avatar from "../../images/avatar.png";

import decode from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import ListItemText from "@mui/material/ListItemText";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import CloseIcon from "@mui/icons-material/Close";
import Slide from "@mui/material/Slide";
import TextField from "@mui/material/TextField";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Axios from "../../constants/Axios";
import { infoToast, successToast } from "../../constants/toast";

export default function NavBar() {
  const location = useLocation();
  const [user, setUser] = React.useState(
    JSON.parse(localStorage.getItem("user"))
  );
  const [showDropdown, setDropdown] = React.useState(false);
    const [open,setOpen]=React.useState(false)
  const navigate = useNavigate();
  React.useEffect(() => {
    const token = user ? user.token : null;

    if (token) {
      const decodedToken = decode(token);

      if (decodedToken.exp * 1000 < new Date().getTime()) {
        localStorage.removeItem("user");

        navigate("/");
      }

      if (user.user.role === 1) {
        if (location.pathname.split("/")[1] !== "admin") {
          navigate("/admin/home");
        }
      } else if (user.user.role === 2) {
        if (location.pathname.split("/")[1] !== "sk") {
          navigate("/sk/home");
        }
      } else if (user.user.role === 3) {
        if (
          location.pathname.split("/")[1] === "admin" ||
          location.pathname.split("/")[1] === "sk"
        ) {
          navigate("/");
        }
      }
    }
  }, [location]);

  const logout = () => {
    localStorage.removeItem("user");
    navigate('/')
    // window.location.reload();
  };
  return (
    <div className="NavBar-main">
      <h4 onClick={() => navigate("/home")}>"Hai {user?.user?.name}"</h4>
      <img src={Avatar} alt="" onClick={() => setDropdown(!showDropdown)} />
      {showDropdown && (
        <div className="nav-drop-down" onMouseLeave={() => setDropdown(false)}>
          {user?.user?.role === 2 && (
            <div onClick={() => navigate("/sk/slots")}>TimeSlot</div>
          )}

          {user?.user?.role == 2 && (
            <>
              <div onClick={()=>setOpen(true)}>Profile</div>
            </>
          )}
          <div onClick={logout}>Logout</div>
        </div>
      )}
      {open && <FullScreenDialog user={user?.user} setOpen={setOpen} />}
    </div>
  );
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export function FullScreenDialog({ user, setOpen }) {
  const [loading, setLoading] = React.useState(false);
  const [edited, setEdited] = React.useState({
    name: user.name,
    mobile: user.mobile,
  });
  const [shop, setShop] = React.useState({});

  React.useEffect(() => {
    setLoading(true);
    Axios.get("/users/get/" + user?._id)
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
           setShop(res.data.shop);
        } else {
          setOpen(false);
        }
      })
      .catch((e) => setOpen(false));
  }, []);

  const saveHandler = () => {
     setLoading(true)
     Axios.post('/users/edit',{name:edited.name,mobile:edited.mobile,_id:user._id,shop}).then(res=>{
         setLoading(false)
         if(res.data.status){
             successToast("profile updated ",4000,()=>{})
             setOpen(false)
         }else{
             infoToast("something wrong")
             setOpen(false)
         }
     }).catch(e=>{
         setOpen(false)
         infoToast("something wrong")
     })
  };

  return (
    <div>
      <Dialog
        fullScreen
        open={true}
       
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={()=>setOpen(false)}
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
                label="Mobile"
                defaultValue={edited.mobile}
                variant="outlined"
                onChange={(e) =>
                  setEdited({ ...edited, mobile: e.target.value })
                }
              />
            </Box>
          </div>
        </ListItem>
        { shop.name && <>
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
                label="shop name"
                defaultValue={shop.name}
                variant="outlined"
                onChange={(e) => setShop({ ...shop, name: e.target.value })}
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
                label="shop email"
                defaultValue={shop.email}
                variant="outlined"
                onChange={(e) => setShop({ ...shop, email: e.target.value })}
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
                label="shop lisence NO"
                defaultValue={shop?.lisenceNO}
                variant="outlined"
                onChange={(e) =>
                    setShop({ ...shop, lisenceNO: e.target.value })
                }
                />
            </Box>
          </div>
        </ListItem>
                </>
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
