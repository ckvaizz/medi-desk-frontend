import './login.css'
import Gif from "../../images/94123-1hour-login-effect.gif"
export default function Login(){
    return(
        
        <div className="login">
            <div className='input-field'>
                <h1>Login</h1>
                <img src={Gif} alt="" />
                <div className="input">
                    <input type="text" placeholder='Mobile' />
                    <input type="password" placeholder='Password'/>
                    <h6>Forgot password !</h6>
                    <button>login</button>
                </div>
                
            </div>
            <div className='text-field'>
                   <div className='text-content'>
                   <p>GET START </p>
                    <p>with</p>
                    <p>MEDI-DESK</p>
                    <button>Sign up</button> 
                   </div>
            </div>
        </div>
    )
} 