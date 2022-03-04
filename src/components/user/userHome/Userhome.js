import './userhome.css'
import Svg from '../../../images/shop.svg'
import { useState } from 'react'
export default function Userhome(){
    const [showSuggestion,setSuggestion]= useState(false)
    const onFocusHandler=()=>{
        setSuggestion(true)
    }
    const onChangeHandler=e=>{
        alert(e.target.value)
    }
    return (

        <div className="userHome-main">
           
               <img src={Svg} alt="" />
               <div className='content-area'>
                   <h4>Book your medicine <span>with</span> <span> MEDI-DESK</span></h4>
                    <div className='search-area'>
                        <input type="text" onFocus={onFocusHandler} onBlur={()=>setSuggestion(false)} onChange={onChangeHandler} placeholder='Search here ..' />
                        {
                            showSuggestion && <div>
                                    <p>hellooooooooooooooooooooooooooooooooooooooooooooooooo </p>
                                    <p>hellooo </p>
                                    <p>hellooo </p>
                                    <p>hellooo </p>
                                    <p>hellooo </p>
                                    <p>hellooo </p>
                                    <p>hellooo </p>
                                    <p>hellooo </p>
                                    <p>hellooo </p>
                                    <p>hellooo </p>
                                    <p>hellooo </p>
                            </div>
                        }
                    </div>
               </div>
        </div>
    )
}