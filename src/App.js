import React, { useEffect, useState } from "react";
import "./App.css";
import Login from "./components/login/Login";
import Signup from "./components/signup/Signup";
import { successToast } from "./constants/toast";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate
} from "react-router-dom";
import Userhome from "./components/user/userHome/Userhome";
import MedicineList from "./components/user/medicineList/MedicineList";
import NavBar from "./components/navBar/NavBar";
import SkHome from "./components/shopkeeper/Home/SkHome";


function App() {
  const [loginOrSignup, setLoginOrSignup] = useState("login");
  const [loginUser,setLoginUser]=useState('')
  const navigate =useNavigate();
  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    if (user)
      setLoginUser(user.user)
    else navigate('/') 
     
  }, []);
  

  return (
    <div className="App">
      {loginUser  && <NavBar user={loginUser} />}
      
        <Routes>
          <Route
            path="/"
            element={
              loginOrSignup === "login" ? (
                <Login setLoginUser={setLoginUser} setLoginOrSignup={setLoginOrSignup} />
              ) : (
                <Signup setLoginOrSignup={setLoginOrSignup} />
              )
            }
          />

          <Route
            path="/login"
            element={
              loginOrSignup === "login" ? (
                <Login setLoginUser={setLoginUser} setLoginOrSignup={setLoginOrSignup} />
              ) : (
                <Signup setLoginOrSignup={setLoginOrSignup} />
              )
            }
          />
          <Route
          path='/home'
          element={<Userhome/>}
          />
          <Route path="/medi-list/:medi" element={<MedicineList/>} />
            <Route path="/sk/home" element={<SkHome/>}/>
        </Routes>
      
    </div>
  );
}

export default App;
