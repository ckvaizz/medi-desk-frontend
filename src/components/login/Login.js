import React, { useEffect, useState } from "react";
import "./login.css";
import Gif from "../../images/94123-1hour-login-effect.gif";
import { errorToast, infoToast, successToast } from "../../constants/toast";
import Axios from "../../constants/Axios";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

export default function Login({ setLoginOrSignup ,setLoginUser }) {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotViewer, setForgotViewer] = useState(false);
  const [forgotPage, setForgotpage] = useState("mobile");
  const [newPassword, setNewPassword] = useState("");
  const [rePassword, setRepassword] = useState("");
  const [otp, setOtp] = useState("");
  const navigate =useNavigate();

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user){
      setLoginUser(user.user)
      navigate('/home')
    }else navigate('/') 
  }, []);
  
  const loginHandler = () => {
    if (!mobile || !password) return infoToast("Missing data");
    setLoading(true);
    Axios.post("/auth/login", { mobile, password })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          localStorage.setItem("user", JSON.stringify(res.data.profile));
          window.location.reload();
        } else {
          errorToast(res.data.message || "invalid login");
        }
      })
      .catch((e) => {
        setLoading(false);
        errorToast("something wrong");
      });
  };
  const verifyMobile = () => {
    if (!mobile) return infoToast("Missing data");

    setLoading(true);
    Axios.post("/auth/verify-mobile", { mobile })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          setForgotpage("otp");
        } else {
          errorToast(res.data.message || "something wrong");
        }
      })
      .catch((e) => {
        setLoading(false);
        errorToast("something went wrong");
      });
  };
  const verifyOtp = () => {
    if (!otp) return infoToast("Missing data");
    setLoading(true);
    Axios.post("/auth/verify-otp", { mobile: "8590150924", otp })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          setForgotpage("pass");
        } else {
          errorToast(res.data.message || "something wrong");
        }
      })
      .catch((e) => {
        setLoading(false);
        errorToast("something wrong");
      }); 
  };

  const changeHandler = () => {
    if (!newPassword || newPassword !== rePassword)
      return infoToast("check your passwords");
    setLoading(true);
    Axios.post("/auth/create-password", { mobile, otp, password: newPassword })
      .then((res) => {
        setLoading(false);
        if (res.data.status) {
          successToast("successfully changed password", 4000, () =>
            window.location.reload()
          );
        } else {
          errorToast(res.data.message || "something wrong");
        }
      })
      .catch((e) => {
        setLoading(false);
        errorToast("something wrong");
      });
  };

  return (
    <div className="login">
      <div className="input-field">
        {forgotViewer ? (
          forgotPage == "mobile" ? (
            <>
              <h1>Forgot password </h1>

              <div className="input">
                <input
                  type="text"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  style={{ marginTop: "54px" }}
                  placeholder="Registered mobile"
                />
                <button onClick={verifyMobile}>
                  {loading ? (
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress />
                    </Box>
                  ) : (
                    "Get otp"
                  )}
                </button>
              </div>
            </>
          ) : forgotPage == "otp" ? (
            <>
              <h1>Forgot password </h1>

              <div className="input">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  style={{ marginTop: "54px" }}
                  placeholder="Enter otp here"
                />
                <button onClick={verifyOtp}>
                  {loading ? (
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress />
                    </Box>
                  ) : (
                    "verify otp"
                  )}
                </button>
              </div>
            </>
          ) : forgotPage === "pass" ? (
            <>
              <h1>Forgot password </h1>

              <div className="input">
                <input
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="new password"
                />
                <input
                  type="text"
                  value={rePassword}
                  placeholder="re-password"
                  onChange={(e) => setRepassword(e.target.value)}
                />
                <button onClick={changeHandler}>
                  {loading ? (
                    <Box sx={{ width: "100%" }}>
                      <LinearProgress />
                    </Box>
                  ) : (
                    "change"
                  )}
                </button>
              </div>
            </>
          ) : (
            ""
          )
        ) : (
          <>
            <h1>Login</h1>
            <img src={Gif} alt="" />
            <div className="input">
              <input
                type="text"
                onChange={(e) => setMobile(e.target.value)}
                placeholder="Mobile"
              />
              <input
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <h6 onClick={() => setForgotViewer(true)}>Forgot password !</h6>
              <button onClick={loginHandler}>
                {loading ? (
                  <Box sx={{ width: "100%" }}>
                    <LinearProgress />
                  </Box>
                ) : (
                  "Login"
                )}
              </button>
            </div>
          </>
        )}
      </div>
      <div className="text-field">
        <div className="text-content">
          <p>GET START </p>
          <p>with</p>
          <p>MEDI-DESK</p>
          <button onClick={() => setLoginOrSignup("signup")}>Sign up</button>
        </div>
      </div>
    </div>
  );
}
