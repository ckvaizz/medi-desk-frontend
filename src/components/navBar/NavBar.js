import './navBar.css'
import Avatar from '../../images/avatar.png'
import { useEffect, useState } from 'react';
import decode from "jwt-decode";
import {  useLocation, useNavigate } from 'react-router-dom';


export default function NavBar(){
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
   const [showDropdown,setDropdown]=useState(false)
   
    const navigate=useNavigate();
    useEffect(() => {
        const token = user?user.token:null;
    
        if (token) {
          const decodedToken = decode(token);
    
          if (decodedToken.exp * 1000 < new Date().getTime()) {
            localStorage.removeItem("user");
            
            navigate('/')
          } 
        
        if(user.user.role===1){
            if(location.pathname.split('/')[1]!=='admin'){
                navigate('/admin/home')
            }
        }else if(user.user.role===2){
            if(location.pathname.split('/')[1]!=='sk'){
                navigate('/sk/home')
            }
        }else if(user.user.role===3){
            if(location.pathname.split('/')[1] ==='admin'||location.pathname.split('/')[1] ==='sk'){
                navigate('/')
            }
        }
       
    }
      }, [location]);

      const logout=()=>{
        localStorage.removeItem("user");
            window.location.reload()    
        
      }
    return(
        <div className='NavBar-main'>
            <h4 onClick={()=>navigate('/home')}>"Hai {user?.user?.name}"</h4>
            <img src={Avatar} alt="" onClick={()=>setDropdown(!showDropdown)} />
           {showDropdown && <div className='nav-drop-down' onMouseLeave={()=>setDropdown(false)} >
                {user?.user?.role !==1 &&<>
                <div>TimeSlot</div>
                <div>Profile</div>
                </>} 
                <div onClick={logout}>Logout</div>
            </div>}
        </div>
    )
}