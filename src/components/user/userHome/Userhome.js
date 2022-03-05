import "./userhome.css";
import Svg from "../../../images/shop.svg";
import { useEffect, useState } from "react";
import Axios from "../../../constants/Axios";
import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from '@mui/material/CircularProgress';
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

export default function Userhome() {
  const [showSuggestion, setSuggestion] = useState(false);
  const [suggestions, setSuggestions] = useState(JSON.parse(localStorage.getItem("recent"))||[]);
  const [loading, setLoading] = useState(false);
  const navigate =useNavigate();



  const onFocusHandler = () => {
    setSuggestion(true);
  };
  const onChangeHandler = (e) => {
      if(!e.target.value) {
          return setLoading(false)
      }
      setLoading(true)
    Axios.post("/medi/suggestion", { data: e.target.value }).then((res) => {
        setLoading(false)
      if (res.data.status) setSuggestions(res.data.suggestions);
    });
  };
const onClickHandler= d =>{
   if(d.name){

       let data = JSON.parse(localStorage.getItem("recent"))
       if(!data){
           localStorage.setItem("recent",JSON.stringify([d.name]))
        }
        let c=[...data,d.name]
        localStorage.setItem("recent",JSON.stringify(c));
    }

    let data = d.name || d
    console.log(data)
    navigate(`/medi-list/${data}`)

    
}
const onBlurHandler=()=>{
    setTimeout(()=>{
        setSuggestion(false)
    },1000)
}
  return (
    <div className="userHome-main">
      <img src={Svg} alt="" />
      <div className="content-area">
        <h4>
          Book your medicine <span>with</span> <span> MEDI-DESK</span>
        </h4>
        <div className="search-area">
          <input
            type="text"
            onFocus={onFocusHandler}
             onBlur={onBlurHandler}
            onChange={onChangeHandler}
            placeholder="Search here .."
          />
          {showSuggestion && (
            <div>
              {loading ? (
                <p>
                  <Box sx={{ display: 'flex' }}>
                  <CircularProgress />
                  </Box>
                </p>
              ) : (
                suggestions.map((item,key) => {
                  return <button onClick={()=>onClickHandler(item)} key={key}>{item?.name || item}</button>;
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
