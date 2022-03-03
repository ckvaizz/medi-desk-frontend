import React, { useEffect, useState } from 'react'
import './App.css';
import Login from './components/login/Login'
import Signup from './components/signup/Signup';
import { successToast } from './constants/toast';


function App() {
  const [loginOrSignup,setLoginOrSignup] = useState('login')
  useEffect(() => {
    let user =JSON.parse(localStorage.getItem("user"));
    if (user) successToast("gotIT",'',()=>{});
  }, []);
  return (
    <div className="App">
      {loginOrSignup ==='login'&&<Login setLoginOrSignup={setLoginOrSignup}/>}
      {loginOrSignup ==='signup'&&<Signup setLoginOrSignup={setLoginOrSignup} />}
    </div>
  );
}

export default App;
