import "./signup.css";
import * as React from "react";
import { styled } from "@mui/material/styles";

import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Axios from "../../constants/Axios";
import { errorToast, infoToast, successToast } from "../../constants/toast";
import LinearProgress from "@mui/material/LinearProgress";

import Box from "@mui/material/Box";
export default function Signup({ setLoginOrSignup }) {
  const [shopKeeper, setShopKeeper] = React.useState(false);
  const [otpViewer, setOtpViewer] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [name, setName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [rePassword, setRepassword] = React.useState("");
  const [shop, setShop] = React.useState({
    name: "",
    email: "",
    lisenceNO: "",
  });
  const [otp, setOtp] = React.useState("");

  const signUpHandler = () => {
    if (!name || !mobile || password !== rePassword || !password)
      return infoToast("Missing data");
    if (shopKeeper && (!shop.name || !shop.lisenceNO))
      return infoToast("Missing data");
    setLoading(true);
    Axios.post("/auth/signup", {
      name,
      mobile,
      password,
      role: shopKeeper ? "2" : "3",
      shop: shopKeeper ? shop : {},
    })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          if (shopKeeper) {
            successToast(
              "Successfully registered please contact admin to verify",
              5500,
              () => window.location.reload()
            );
          } else {
            setOtpViewer(true);
          }
        } else errorToast(res.data.message || "Something wrong");
      })
      .catch((e) => {
        setLoading(false);
        errorToast("something wrong ");
      });
  };
  const otpHandler = () => {
    if (!otp) return infoToast("Missing data");
    setLoading(true);
    Axios.post("/auth/verify-otp", { mobile, otp })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          successToast(
            "Successfully registerd please login to continue",
            5500,
            () => window.location.reload()
          );
        } else errorToast(res.data.message || "failed to verify");
      })
      .catch((e) => {
        setLoading(false);
        errorToast("something wrong");
      });
  };
  return (
    <div className="signup">
      <div className="text-field-signup">
        <div className="text-content">
          <p>GET START </p>
          <p>with</p>
          <p>MEDI-DESK</p>
          <button onClick={() => setLoginOrSignup("login")}>Login</button>
        </div>
      </div>
      <div className="input-field-signup">
        <h1>Sign up</h1>
        {!otpViewer ? (
          <div className="input">
            <input
              type="text"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Mobile"
              onChange={(e) => setMobile(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              placeholder="Re-password"
              onChange={(e) => setRepassword(e.target.value)}
            />
            <FormControlLabel
              control={
                <Android12Switch onChange={() => setShopKeeper(!shopKeeper)} />
              }
              label="Shopkeeper"
            />
            {shopKeeper && (
              <>
                <input
                  type="text"
                  placeholder="Shop name"
                  onChange={(e) => setShop({ ...shop, name: e.target.value })}
                />
                <input
                  type="email"
                  placeholder="Shop email"
                  onChange={(e) => setShop({ ...shop, email: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="shop lisence number"
                  onChange={(e) =>
                    setShop({ ...shop, lisenceNO: e.target.value })
                  }
                />{" "}
              </>
            )}
            <button onClick={signUpHandler}>
              {loading ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              ) : (
                "Sign up"
              )}
            </button>
          </div>
        ) : (
          <div className="otp-viewer">
            <h5>OTP</h5>
            <input
              type="text"
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter otp here.."
            />
            <button onClick={otpHandler}>
              {loading ? (
                <Box sx={{ width: "100%" }}>
                  <LinearProgress />
                </Box>
              ) : (
                "Verify"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const Android12Switch = styled(Switch)(({ theme }) => ({
  padding: 8,
  "& .MuiSwitch-track": {
    borderRadius: 22 / 2,
    "&:before, &:after": {
      content: '""',
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      width: 16,
      height: 16,
    },
    "&:before": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z"/></svg>')`,
      left: 12,
    },
    "&:after": {
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 24 24"><path fill="${encodeURIComponent(
        theme.palette.getContrastText(theme.palette.primary.main)
      )}" d="M19,13H5V11H19V13Z" /></svg>')`,
      right: 12,
    },
  },
  "& .MuiSwitch-thumb": {
    boxShadow: "none",
    width: 16,
    height: 16,
    margin: 2,
  },
}));
