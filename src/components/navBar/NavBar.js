import './navBar.css'
import Avatar from '../../images/avatar.png'


export default function NavBar({user}){

    return(
        <div className='NavBar-main'>
            <h4>"Hai {user.name}"</h4>
            <img src={Avatar} alt="" />
        </div>
    )
}